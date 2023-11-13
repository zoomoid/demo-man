package colors

import "encoding/json"

type swatch struct {
	rgb        [3]uint8
	yiq        float64
	population float64
	hex        string
	hsl        *[3]float64
}

func NewSwatch(r, g, b uint8, population float64) *swatch {
	return &swatch{
		rgb:        [3]uint8{r, g, b},
		population: population,

		yiq: float64(int(r)*299+int(g)*587+int(b)*114) / 1000,
	}
}

func (sw *swatch) Hex() string {
	if sw.hex == "" {
		sw.hex = RgbToHex(sw.rgb[0], sw.rgb[1], sw.rgb[2])
	}
	return sw.hex
}

func (sw *swatch) Hsl() [3]float64 {
	if sw.hsl == nil {
		h, s, l := RgbToHsl(sw.rgb[0], sw.rgb[1], sw.rgb[2])
		sw.hsl = &[3]float64{h, s, l}
	}
	return *sw.hsl
}

func (sw *swatch) Rgb() [3]uint8 {
	return sw.rgb
}

func (sw *swatch) R() uint8 {
	return sw.rgb[0]
}

func (sw *swatch) G() uint8 {
	return sw.rgb[1]
}

func (sw *swatch) B() uint8 {
	return sw.rgb[2]
}

func (sw *swatch) Population() float64 {
	return sw.population
}

const (
	ColorBlack string = "#000000"
	ColorWhite string = "#ffffff"
)

func (sw *swatch) TitleTextColor() string {
	if sw.yiq < 200 {
		return ColorWhite
	} else {
		return ColorBlack
	}
}

func (sw *swatch) BodyTextColor() string {
	if sw.yiq < 150 {
		return ColorWhite
	} else {
		return ColorBlack
	}
}

func (sw *swatch) MarshalJSON() ([]byte, error) {
	type jsonSwatch struct {
		RGB        [3]uint8 `json:"rgb,omitempty"`
		Population float64  `json:"population,omitempty"`
	}

	return json.Marshal(jsonSwatch{
		RGB:        sw.rgb,
		Population: sw.population,
	})
}

func ApplyFilter(colors []swatch, f filter) []swatch {
	if f == nil {
		return colors
	}
	a := make([]swatch, 0)
	for _, sw := range colors {
		var r, g, b uint8 = sw.R(), sw.G(), sw.B()
		if f(r, g, b, 255) {
			a = append(a, sw)
		}
	}
	return a
}
