package m4a

import (
	"fmt"
	"os"
	"os/exec"
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
}

const (
	ffmpegExecutable string = "/usr/bin/ffmpeg"
)

func init() {
	// // probe ffmpeg executable
	// cmd := exec.Command(fmt.Sprintf("which %s", ffmpegExecutable))
	// err := cmd.Run()
	// if err != nil {
	// 	panic(fmt.Errorf("failed to probe ffmpeg executable: %w", err))
	// }
}

func SetMetadata(fn string, m *Metadata) error {
	args := []string{
		"-i",
		fn,
		// "-c:a",
		// "aac",
		"-c:v",
		"copy",
		// "-f",
		// "mp4",
		// "-y",
	}
	metadataArgs := []string{
		fmt.Sprintf("album=\"%s\"", m.Album),
		fmt.Sprintf("author=\"%s\"", m.Artist),
		fmt.Sprintf("album_artist=\"%s\"", m.AlbumArtist),
		fmt.Sprintf("composer=\"%s\"", m.Composer),
		fmt.Sprintf("date=\"%s\"", m.Date),
		fmt.Sprintf("description=\"%s\"", m.Description),
		fmt.Sprintf("disc=\"%s\"", m.DiscNumber),
		fmt.Sprintf("track=\"%s\"", m.Track),
		fmt.Sprintf("year=\"%s\"", m.Year),
		fmt.Sprintf("genre=\"%s\"", m.Genre),
		fmt.Sprintf("title=\"%s\"", m.Title),
		fmt.Sprintf("comment=\"%s\"", m.Comment),
	}
	for _, arg := range metadataArgs {
		args = append(args, "-metadata")
		args = append(args, arg)
	}

	tmpFile, err := os.CreateTemp("", "*")
	if err != nil {
		return err
	}
	tmpFile.Close()

	args = append(args, tmpFile.Name()+".m4a") // output

	cmd := exec.Command(ffmpegExecutable, args...)
	cmd.Stderr = os.Stderr
	cmd.Stdout = os.Stdout

	fmt.Println(cmd.Args)

	err = cmd.Start()
	if err != nil {
		return err
	}
	err = cmd.Wait()
	if err != nil {
		return err
	}

	newFile, err := os.ReadFile(tmpFile.Name() + ".m4a")
	if err != nil {
		return err
	}

	f, err := os.Create(fn)
	if err != nil {
		return err
	}
	defer f.Close()
	_, err = f.Write(newFile)
	if err != nil {
		return err
	}
	return nil
}

func SetPicture(fn string, pictureFn string) error {

	return nil
}
