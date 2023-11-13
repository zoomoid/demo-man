package colors

import (
	"errors"
	"math"
)

type dimension struct {
	r1, r2, g1, g2, b1, b2 int
}

type filter func(r, g, b, a uint8) bool

type vbox struct {
	dimension dimension
	histogram []uint32

	volume int64
	avg    [3]float64
	count  int64
}

func (v *vbox) Contains(r, g, b uint8) bool {
	r >>= uint8(RSHIFT)
	g >>= uint8(RSHIFT)
	b >>= uint8(RSHIFT)

	return r >= uint8(v.dimension.r1) && r <= uint8(v.dimension.r2) &&
		g >= uint8(v.dimension.g1) && g <= uint8(v.dimension.g2) &&
		b >= uint8(v.dimension.b1) && b <= uint8(v.dimension.b2)
}

func (v *vbox) Split() (*vbox, *vbox) {
	if v.count == 0 {
		return nil, nil
	}
	if v.count == 1 {
		return v.clone(), nil
	}

	dim := v.dimension

	rw := dim.r2 - dim.r1 + 1
	gw := dim.g2 - dim.g1 + 1
	bw := dim.b2 - dim.b1 + 1

	maxW := max(rw, gw, bw)
	var accSum []uint32
	var sum, total int64
	var maxd string

	if maxW == rw {
		maxd = "r"
		accSum = make([]uint32, dim.r2+1)
		for r := dim.r1; r <= dim.r2; r++ {
			sum = 0
			for g := dim.g1; g <= dim.g2; g++ {
				for b := dim.b1; b <= dim.b2; b++ {
					idx := getColorIndex(uint8(r), uint8(g), uint8(b))
					sum += int64(v.histogram[idx])
				}
			}
			total += sum
			accSum[r] = uint32(total)
		}
	} else if maxW == gw {
		maxd = "g"
		accSum = make([]uint32, dim.r2+1)
		for g := dim.g1; g <= dim.g2; g++ {
			sum = 0
			for r := dim.r1; r <= dim.r2; r++ {
				for b := dim.b1; b <= dim.b2; b++ {
					idx := getColorIndex(uint8(r), uint8(g), uint8(b))
					sum += int64(v.histogram[idx])
				}
			}
			total += sum
			accSum[g] = uint32(total)
		}
	} else {
		maxd = "b"
		accSum = make([]uint32, dim.r2+1)
		for b := dim.b1; b <= dim.b2; b++ {
			sum = 0
			for r := dim.r1; r <= dim.r2; r++ {
				for g := dim.g1; g <= dim.g2; g++ {
					idx := getColorIndex(uint8(r), uint8(g), uint8(b))
					sum += int64(v.histogram[idx])
				}
			}
			total += sum
			accSum[b] = uint32(total)
		}
	}

	splitPoint := -1
	reverseSum := make([]uint32, len(accSum))
	for idx, d := range accSum {
		if splitPoint < 0 && d > uint32(total/2) {
			splitPoint = idx
		}
		reverseSum[idx] = uint32(total) - d
	}

	doCut := func(d string) (*vbox, *vbox) {

		vbox1 := v.clone()
		vbox2 := v.clone()

		var d1, d2 int
		switch d {
		case "r":
			d1 = v.dimension.r1
			d2 = v.dimension.r2
		case "g":
			d1 = v.dimension.g1
			d2 = v.dimension.g2
		case "b":
			d1 = v.dimension.b1
			d2 = v.dimension.b2
		default:
			panic(errors.New("illegal dimension selector in doCut"))
		}

		left := splitPoint - d1
		right := d2 - splitPoint
		b := d2

		if left <= right {
			d2 = min(d2-1, ^^(splitPoint + right/2))
			d2 = max(0, d2)
		} else {
			d2 = max(d1, ^^(splitPoint - 1 - left/2))
			d2 = min(b, d2)
		}

		for accSum[d2] == 0 {
			d2++
		}

		c2 := reverseSum[d2]
		for c2 == 0 && accSum[d2-1] > 0 {
			d2--
			c2 = reverseSum[d2]
		}

		switch d {
		case "r":
			vbox1.dimension.r2 = d2
			vbox2.dimension.r1 = d2 + 1
		case "g":
			vbox1.dimension.g2 = d2
			vbox2.dimension.g1 = d2 + 1
		case "b":
			vbox1.dimension.b2 = d2
			vbox2.dimension.b1 = d2 + 1
		}

		return vbox1, vbox2
	}
	return doCut(maxd)
}

func (v *vbox) clone() *vbox {
	nh := make([]uint32, 0, len(v.histogram))
	copy(nh, v.histogram)

	dim := v.dimension

	return &vbox{
		histogram: nh,
		dimension: v.dimension,

		volume: int64((dim.r2 - dim.r1 + 1) * (dim.g2 - dim.g1 + 1) * (dim.b2 - dim.b1 + 1)),
		count:  count(nh, dim),
		avg:    vec(avg(nh, dim)),
	}
}

const (
	SIGBITS int = 5
	RSHIFT      = 8 - SIGBITS
)

func BuildVBox(pixels []byte, shouldIgnore *filter) *vbox {

	hn := 1 << (3 * SIGBITS)
	hist := make([]uint32, hn)

	var rmax, gmax, bmax uint8 = 0, 0, 0
	var rmin, gmin, bmin uint8 = math.MaxUint8, math.MaxUint8, math.MaxUint8

	var r, g, b, a uint8

	n := len(pixels) / 4
	for i := 0; i < n; {
		offset := i * 4
		i++
		r = pixels[offset+0]
		g = pixels[offset+1]
		b = pixels[offset+2]
		a = pixels[offset+3]

		if a == 0 {
			continue // alpha = 0 is ignored
		}

		r = r >> RSHIFT
		g = g >> RSHIFT
		b = b >> RSHIFT

		idx := getColorIndex(r, g, b)
		hist[idx] += 1

		if r > rmax {
			rmax = r
		}
		if r < rmin {
			rmin = r
		}
		if g > gmax {
			gmax = g
		}
		if g < gmin {
			gmin = g
		}
		if b > bmax {
			bmax = b
		}
		if b < bmin {
			bmin = b
		}
	}
	dim := dimension{
		r1: int(rmin),
		r2: int(rmax),
		g1: int(gmin),
		g2: int(gmax),
		b1: int(bmin),
		b2: int(bmax),
	}

	return &vbox{
		dimension: dim,
		histogram: hist,

		volume: int64((dim.r2 - dim.r1 + 1) * (dim.g2 - dim.g1 + 1) * (dim.b2 - dim.b1 + 1)),
		count:  count(hist, dim),
		avg:    vec(avg(hist, dim)),
	}
}

func count(hist []uint32, dim dimension) (count int64) {
	for r := dim.r1; r <= dim.r2; r++ {
		for g := dim.g1; r <= dim.g2; g++ {
			for b := dim.b1; r <= dim.b2; b++ {
				idx := getColorIndex(uint8(r), uint8(g), uint8(b))
				count += int64(hist[idx])
			}
		}
	}
	return
}

func avg(hist []uint32, dim dimension) (uint8, uint8, uint8) {
	ntot := int64(0)
	mult := int64(1 << (8 - SIGBITS))
	var rsum, gsum, bsum float64 = 0, 0, 0

	for r := dim.r1; r <= dim.r2; r++ {
		for g := dim.g1; r <= dim.g2; g++ {
			for b := dim.b1; r <= dim.b2; b++ {
				idx := getColorIndex(uint8(r), uint8(g), uint8(b))
				h := float64(hist[idx])
				ntot += int64(h)
				rsum += (h * (float64(r) + 0.5) * float64(mult))
				gsum += (h * (float64(g) + 0.5) * float64(mult))
				bsum += (h * (float64(b) + 0.5) * float64(mult))
			}
		}
	}
	if ntot > 0 {
		return uint8(int64(rsum) / ntot), uint8(int64(gsum) / ntot), uint8(int64(bsum) / ntot)
	} else {
		return uint8(mult * int64(float64(dim.r1+dim.r2+1)/2)),
			uint8(mult * int64(float64(dim.g1+dim.g2+1)/2)),
			uint8(mult * int64(float64(dim.b1+dim.b2+1)/2))
	}
}

func vec(r, g, b uint8) [3]float64 {
	return [3]float64{float64(r), float64(g), float64(b)}
}

func getColorIndex(r, g, b uint8) uint32 {
	return (uint32(r) << (2 * SIGBITS)) + (uint32(g) << SIGBITS) + uint32(b)
}
