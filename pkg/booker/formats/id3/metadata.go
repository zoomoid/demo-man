package id3

import (
	"errors"
	"os"
	"path"

	id3 "github.com/bogem/id3v2/v2"
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

func SetMetadata(fn string, m *Metadata) error {
	tag, err := id3.Open(fn, id3.Options{
		Parse: false, // don't need to parse existing tags, we'll override them anyways
	})
	if err != nil {
		return err
	}

	// this is way more inconvenient than instrumenting metaflac lol...
	tag.SetAlbum(m.Album)
	tag.AddTextFrame(tag.CommonID("Band/Orchestra/Accompaniment"), tag.DefaultEncoding(), m.AlbumArtist)
	tag.SetArtist(m.Artist)
	tag.AddTextFrame(tag.CommonID("Composer"), tag.DefaultEncoding(), m.Composer)
	tag.AddTextFrame(tag.CommonID("Date"), tag.DefaultEncoding(), m.Date)
	tag.AddTextFrame(tag.CommonID("Title/Songname/Content description"), tag.DefaultEncoding(), m.Description)
	tag.AddTextFrame(tag.CommonID("Part of a set"), tag.DefaultEncoding(), m.DiscNumber)
	tag.AddTextFrame(tag.CommonID("Track number/Position in set"), tag.DefaultEncoding(), m.Track)
	tag.SetYear(m.Year)
	tag.SetGenre(m.Genre)
	tag.SetTitle(m.Title)
	tag.AddCommentFrame(id3.CommentFrame{
		Encoding:    tag.DefaultEncoding(),
		Description: "Comment",
		Text:        m.Comment,
	})
	tag.AddTextFrame(tag.CommonID("BPM"), tag.DefaultEncoding(), m.Bpm)

	err = tag.Save()
	if err != nil {
		return err
	}
	return nil
}

var (
	knownImageTypes map[string]string = map[string]string{
		"jpeg": "image/jpeg",
		"jpg":  "image/jpeg",
		"png":  "image/png",
		// TODO(zoomoid): add more to the mapping
	}

	ErrUnknownImageFormat error = errors.New("unknown image format")
)

func SetPicture(fn string, pictureFn string) error {
	tag, err := id3.Open(fn, id3.Options{
		Parse: false, // don't need to parse existing tags, we'll override them anyways
	})
	if err != nil {
		return err
	}

	artwork, err := os.ReadFile(pictureFn)
	if err != nil {
		return err
	}
	mimeType, ok := knownImageTypes[path.Ext(pictureFn)]
	if !ok {
		return ErrUnknownImageFormat
	}

	frame := id3.PictureFrame{
		Encoding:    tag.DefaultEncoding(),
		MimeType:    mimeType,
		PictureType: id3.PTFrontCover,
		Description: "Front cover",
		Picture:     artwork,
	}
	tag.AddAttachedPicture(frame)

	err = tag.Save()
	if err != nil {
		return err
	}
	return nil
}
