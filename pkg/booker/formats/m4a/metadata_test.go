package m4a

import "testing"

var (
	testFilename string = "fixtures/01_how_did_we_get_here_alac.m4a"

	testMetadata Metadata = Metadata{
		Album:       "All Things Must End",
		AlbumArtist: "Zoomoid",
		Artist:      "Zoomoid",
		Composer:    "Alexander Bartolomey",
		Date:        "29.12.2023",
		Description: "Demo for booker",
		DiscNumber:  "1 of 1",
		Track:       "1 of 14",
		Year:        "2023",
		Genre:       "Instrumental",
		Title:       "How Did We Get Here?",
		Comment:     "Demo for booker",
	}
)

func TestSetMetadata(t *testing.T) {
	err := SetMetadata(testFilename, &testMetadata)
	if err != nil {
		t.Error(err)
	}
}
