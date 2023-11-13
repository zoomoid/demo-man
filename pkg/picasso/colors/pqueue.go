package colors

import (
	"slices"
)

type pqueue[T any] struct {
	contents []T

	comparator func(T, T) int
	sorted     bool
}

func NewQueue[T any](comparator func(t1, t2 T) int) *pqueue[T] {
	return &pqueue[T]{
		contents:   make([]T, 0),
		comparator: comparator,
		sorted:     false,
	}
}

func (q *pqueue[T]) sort() {
	if !q.sorted {
		slices.SortFunc(q.contents, q.comparator)
		q.sorted = true
	}
}

func (q *pqueue[T]) Push(item T) {
	q.contents = append(q.contents, item)
	q.sorted = false
}

func (q *pqueue[T]) Peek(index int) T {
	q.sort()

	idx := index
	if index < 0 {
		idx = len(q.contents) - 1
	}
	return q.contents[idx]
}

func (q *pqueue[T]) Pop() *T {
	q.sort()

	if len(q.contents) < 1 {
		return nil
	}

	t := q.contents[0]
	q.contents = q.contents[1:]
	return &t
}

func (q *pqueue[T]) Size() int {
	return len(q.contents)
}

func (q *pqueue[T]) Visit(f func(item T, index int) error) error {
	q.sort()

	for idx, item := range q.contents {
		err := f(item, idx)
		if err != nil {
			return err
		}
	}
	return nil
}
