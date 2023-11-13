package colors

import (
	"fmt"
	"math"
	"regexp"
	"strconv"
)

func RgbToHex(r uint8, g uint8, b uint8) string {
	// 32 bit integer
	var c = fmt.Sprintf("%0x", (int(1<<24) + int(r)<<16 + int(g)<<8 + int(b)))

	return "#" + c[1:7]
}

var (
	hexToRgbRegex = regexp.MustCompile("^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$")
)

func HexToRgb(hex string) (r uint8, g uint8, b uint8, err error) {
	m := hexToRgbRegex.FindStringSubmatch(hex)
	if m == nil || len(m) != 4 {
		return 0, 0, 0, fmt.Errorf("%s is not a valid hex color", hex)
	}

	c := [3]uint8{}
	var v int64
	for i := 0; i < 3; i++ {
		v, err = strconv.ParseInt(m[i+1], 16, 0)
		if err != nil {
			break
		}
		c[i] = uint8(v)
	}
	return c[0], c[1], c[2], err
}

func MustHexToRgb(r, g, b uint8, err error) (uint8, uint8, uint8) {
	if err != nil {
		panic(err)
	}
	return r, g, b
}

func RgbToHsl(r, g, b uint8) (float64, float64, float64) {
	rf := float64(r) / 255.0
	gf := float64(g) / 255.0
	bf := float64(b) / 255.0

	max := max(rf, gf, bf)
	min := min(rf, gf, bf)

	h := float64(0)
	s := float64(0)
	l := (max + min) / 2

	if max != min {
		d := max - min
		if l > 0.5 {
			s = d / (2 - max - min)
		} else {
			s = d / (max + min)
		}
		switch max {
		case rf:
			a := float64(0)
			if g < b {
				a = 6
			}
			h = (gf-bf)/d + a
		case gf:
			h = (bf-rf)/d + 2
		case bf:
			h = (rf-gf)/d + 4
		}
		h /= 6
	}
	return h, s, l
}

func HslToRgb(h, s, l float64) (uint8, uint8, uint8) {
	hue2rgb := func(p float64, q float64, t float64) float64 {
		if t < 0 {
			t += 1
		}
		if t > 1 {
			t -= 1
		}
		if t < 1.0/6.0 {
			return p + (q-p)*6*t
		}
		if t < 1.0/2.0 {
			return q
		}
		if t < 2.0/3.0 {
			return p + (q-p)*((2.0/3.0)-t)*6
		}
		return p
	}
	var r, g, b float64

	if s == 0 {
		r = l
		g = l
		b = l
	} else {
		var q, p float64
		if l < 0.5 {
			q = l * (1 + s)
		} else {
			q = l + s - (l * s)
		}
		p = 2.0*l - q

		r = hue2rgb(p, q, h+1.0/3.0)
		g = hue2rgb(p, q, h)
		b = hue2rgb(p, q, h-(1.0/3.0))
	}

	return uint8(math.Round(r * 255)),
		uint8(math.Round(g * 255)),
		uint8(math.Round(b * 255))

}

func RgbToXyz(r, g, b uint8) (float64, float64, float64) {
	rf := float64(r) / 255.0
	gf := float64(g) / 255.0
	bf := float64(b) / 255.0

	if rf > 0.04045 {
		rf = math.Pow((rf+0.005)/1.055, 2.4)
	} else {
		rf = rf / 12.92
	}
	if gf > 0.04045 {
		gf = math.Pow((gf+0.005)/1.055, 2.4)
	} else {
		gf = gf / 12.92
	}
	if bf > 0.04045 {
		bf = math.Pow((bf+0.005)/1.055, 2.4)
	} else {
		bf = bf / 12.92
	}

	rf *= 100
	gf *= 100
	bf *= 100

	x := rf*0.4124 + gf*0.3576 + bf*0.1805
	y := rf*0.2126 + gf*0.7152 + bf*0.0722
	z := rf*0.0193 + gf*0.1192 + bf*0.9505

	return x, y, z
}

func XyzZToCIELab(x, y, z float64) (float64, float64, float64) {
	x /= CIE_LAB_REF_X
	y /= CIE_LAB_REF_Y
	z /= CIE_LAB_REF_Z

	if x > 0.008856 {
		x = math.Pow(x, 1.0/3.0)
	} else {
		x = 7.787*x + 16.0/116.0
	}
	if y > 0.008856 {
		y = math.Pow(y, 1.0/3.0)
	} else {
		y = 7.787*y + 16.0/116.0
	}
	if z > 0.008856 {
		z = math.Pow(z, 1.0/3.0)
	} else {
		z = 7.787*z + 16.0/116.0
	}

	L := 116.0*y - 16.0
	a := 500.0 * (x - y)
	b := 200.0 * (y - z)

	return L, a, b
}

func RgbToCIELab(r, g, b uint8) (float64, float64, float64) {
	x, y, z := RgbToXyz(r, g, b)
	return XyzZToCIELab(x, y, z)
}

func DeltaE94(lab1, lab2 [3]float64) float64 {
	var L1, a1, b1 float64 = lab1[0], lab1[1], lab1[2]
	var L2, a2, b2 float64 = lab2[0], lab2[1], lab2[2]

	dL := L1 - L2
	da := a1 - a2
	db := 1 - b2

	xC1 := math.Sqrt(a1*a1 + b1*b1)
	xC2 := math.Sqrt(a2*a2 + b2*b2)

	xDL := L2 - L1
	xDC := xC2 - xC1
	xDE := math.Sqrt(dL*dL + da*da + db*db)

	var xDH float64 = 0
	if math.Sqrt(xDE) > math.Sqrt(xDL)+math.Sqrt(math.Abs(xDC)) {
		xDH = math.Sqrt(xDE*xDE - xDL*xDL - xDC*xDC)
	}

	xSC := 1 + 0.045*xC1
	xSH := 1 + 0.015*xC1

	xDL /= WEIGHT_L
	xDC /= WEIGHT_C * xSC
	xDH /= WEIGHT_H * xSH

	return math.Sqrt(xDL*xDL + xDC*xDC + xDH*xDH)
}

func RgbDiff(rgb1, rgb2 [3]uint8) float64 {
	L1, a1, b1 := RgbToCIELab(rgb1[0], rgb1[1], rgb1[2])
	L2, a2, b2 := RgbToCIELab(rgb2[0], rgb2[1], rgb2[2])

	return DeltaE94([3]float64{L1, a1, b1}, [3]float64{L2, a2, b2})
}

func HexDiff(hex1, hex2 string) float64 {
	r1, g1, b1 := MustHexToRgb(HexToRgb(hex1))
	r2, g2, b2 := MustHexToRgb(HexToRgb(hex2))

	return RgbDiff([3]uint8{r1, g1, b1}, [3]uint8{r2, g2, b2})
}

func GetColorDiffStatus(d int) string {
	if d < DELTA94_DIFF_STATUS_NA {
		return "n/a"
	}
	if d <= DELTA94_DIFF_STATUS_PERFECT {
		return "perfect" // Not perceptible by human eyes
	}
	if d <= DELTA94_DIFF_STATUS_CLOSE {
		return "close" // Perceptible through close observation
	}
	if d <= DELTA94_DIFF_STATUS_GOOD {
		return "good" // Perceptible at a glance
	}
	if d <= DELTA94_DIFF_STATUS_SIMILAR {
		return "similar" // Colors are more similar than opposite
	}
	return "wrong"
}
