package flac

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"text/template"

	"github.com/lithammer/dedent"
)

type Metadata struct {
	Album       string
	AlbumArtist string
	Artist      string
	Composer    string
	Date        string
	Description string
	DiscNumber  string
	Track       string
	Year        string
	Genre       string
	Title       string
	Comment     string
	Bpm         string
}

const (
	flacmetaExecutable string = "/bin/metaflac"
)

func init() {
	// probe flacmeta executable
	cmd := exec.Command(fmt.Sprintf("which %s", flacmetaExecutable))
	err := cmd.Run()
	if err != nil {
		panic(fmt.Errorf("failed to probe flacmeta executable: %w", err))
	}
}

var (
	templatePreset string = strings.TrimPrefix(dedent.Dedent(`
ALBUM={{.Album}}
ALBUMARTIST={{.AlbumArtist}}
ARTIST={{.Artist}}
COMPOSER={{.Composer}}
DATE={{.Date}}
DESCRIPTION={{.Description}}
DISCNUMBER={{.DiscNumber}}
TRACKNUMBER={{.Track}}
YEAR={{.Year}}
GENRE={{.Genre}}
TITLE={{.Title}}
COMMENT={{.Comment}}
BPM={{.Bpm}}`), "\n")

	tmpl = template.Must(template.New("flac_metadata").Parse(templatePreset))
)

// SetMetadata uses metaflac for a given file which is supposed to be a flac audio file
// to set metadata according to the given object. Note that *all* previously existing
// tags will be removed from the file!
//
// Note that both SetMetadata and SetPicture use the OS's shell under the hood; writing
// data using pipes and other string-based data! This is inherently suceptible to shell escapes
// and should therefore be used only with safe values.
func SetMetadata(fn string, m *Metadata) error {
	w := new(bytes.Buffer)
	err := tmpl.Execute(w, m)
	if err != nil {
		return err
	}

	cmd := exec.Command(flacmetaExecutable, "--remove-all-tags", "--import-tags-from=-", fn) // --import-tags-from=- reads from stdin
	cmd.Stderr = os.Stderr

	p, err := cmd.StdinPipe()
	if err != nil {
		return err
	}
	err = cmd.Start()
	if err != nil {
		return err
	}
	// TODO(zoomoid): maybe catch errors here?
	p.Write(w.Bytes())
	p.Close()
	err = cmd.Wait()
	if err != nil {
		return err
	}
	return nil
}

// SetPicture sets a FLAC's picture as in album cover or else from a given file path where the image lies.
func SetPicture(fn string, pictureFn string) error {
	cmd := exec.Command(flacmetaExecutable, "--import-picture-from", pictureFn)
	err := cmd.Start()
	if err != nil {
		return err
	}
	err = cmd.Wait()
	if err != nil {
		return err
	}
	return nil
}
