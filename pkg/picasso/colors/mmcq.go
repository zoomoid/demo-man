package colors

import "errors"

const (
	fractByPopulation float64 = 0.75
)

func splitBoxes(pq *pqueue[*vbox], target int) {
	lastSize := pq.Size()
	for pq.Size() < target {
		v := pq.Pop()
		if v == nil {
			break
		}

		vbox := *v

		if vbox != nil && vbox.count > 0 {
			vbox1, vbox2 := vbox.Split()
			if vbox1 == nil {
				break
			}
			pq.Push(vbox1)
			if vbox2 != nil && vbox2.count > 0 {
				pq.Push(vbox2)
			}
			if pq.Size() == lastSize {
				break
			} else {
				lastSize = pq.Size()
			}
		} else {
			break
		}
	}
}

type Options struct {
	ColorCount    int
	Quality       int
	MaxDimensions int
	Filters       []filter
}

func MMCQ(pixels []byte, opts Options) ([]*swatch, error) {
	if len(pixels) == 0 {
		return nil, errors.New("image must not be empty")
	}
	if opts.ColorCount < 2 || opts.ColorCount > 256 {
		return nil, errors.New("illegal color count parameter")
	}

	vBox := BuildVBox(pixels, nil)
	// hist := vBox.histogram
	// colorCount := len(hist)
	pq := NewQueue[*vbox](func(t1, t2 *vbox) int {
		return int(t1.count - t2.count)
	})

	pq.Push(vBox)

	splitBoxes(pq, int(fractByPopulation*float64(opts.ColorCount)))

	pq2 := NewQueue[*vbox](func(t1, t2 *vbox) int {
		return int(t1.count*t1.volume - t2.count*t2.volume)
	})
	pq2.contents = pq.contents

	splitBoxes(pq2, opts.ColorCount-pq2.Size())

	return generateSwatches(pq2), nil
}

func generateSwatches(pq *pqueue[*vbox]) []*swatch {
	swatches := make([]*swatch, 0)
	for pq.Size() > 0 {
		v := pq.Pop()
		if v == nil {
			break
		}
		color := (*v).avg
		count := (*v).count
		var r, g, b uint8 = uint8(color[0]), uint8(color[1]), uint8(color[2])
		swatches = append(swatches, NewSwatch(r, g, b, float64(count)))
	}
	return swatches
}
