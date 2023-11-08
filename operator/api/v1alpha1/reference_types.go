package v1alpha1

type AlbumCoverReference struct {
	Name     string
	Optional bool
}

type AlbumTrackReference struct {
	Name string
}

type TrackRevisionReference struct {
	Name       string
	Generation int
}

type TrackReference struct {
	Name  string `json:"name,omitempty"`
	Album string `json:"album,omitempty"`
}

type RevisionReference struct {
	Name string `json:"name,omitempty"`
}

type CoverReference struct {
	Album string `json:"album,omitempty"`
}

type AlbumReference struct {
	Name string `json:"name,omitempty"`
}
