package colors

import (
	"slices"
	"testing"
)

func TestRgbToHex(t *testing.T) {
	t.Parallel()

	t.Run("leading zeroes", func(t *testing.T) {
		hex := RgbToHex(0, 0, 0)
		if hex != "#000000" {
			t.Errorf("expected %s, found %s", "#000000", hex)
		}
	})

	t.Run("leading zeroes (2)", func(t *testing.T) {
		hex := RgbToHex(0, 255, 127)
		if hex != "#00ff7f" {
			t.Errorf("expected %s, found %s", "#00ff7f", hex)
		}
	})
}

func TestHexToRgb(t *testing.T) {
	t.Parallel()

	t.Run("#000000", func(t *testing.T) {
		r, g, b, err := HexToRgb("#000000")
		if err != nil {
			t.Fatal(err)
		}
		rgb := []uint8{r, g, b}
		src := []uint8{0, 0, 0}
		if !slices.Equal(src, rgb) {
			t.Errorf("expected %v, found %v", src, rgb)
		}
	})

	t.Run("#00ff7f", func(t *testing.T) {
		r, g, b, err := HexToRgb("#00ff7f")
		if err != nil {
			t.Fatal(err)
		}
		rgb := []uint8{r, g, b}
		src := []uint8{0, 255, 127}
		if !slices.Equal(src, rgb) {
			t.Errorf("expected %v, found %v", src, rgb)
		}
	})
}

func TestHslToRgb(t *testing.T) {
	t.Parallel()

	t.Run("symmetric", func(t *testing.T) {
		// TODO(zoomoid): clearly this operation "should" be symmetrical, but it appears
		// that there is precision loss at work. See fixtures/reference.ts
		// TODO(zoomoid): rounding solves this issue but is this legal?
		// t.Skip("precision issue, should be symmetric but isn't")

		var srcR, srcG, srcB uint8 = 255, 0, 255
		h, s, l := RgbToHsl(srcR, srcG, srcB)
		r, g, b := HslToRgb(h, s, l)

		src := []uint8{srcR, srcG, srcB}
		rgb := []uint8{r, g, b}

		if !slices.Equal(src, rgb) {
			t.Errorf("expected %v, found %v", src, rgb)
		}
	})
}
