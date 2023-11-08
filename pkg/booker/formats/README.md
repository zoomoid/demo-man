# booker/formats

We currently work with MP3, FLAC, AAC, and WAV PCMs. However, the landscape of Go libraries supporting
metadata writing is really sparse. For

1. FLAC, we instrument `flacmeta`, a CLI providing access to metadata of flac files, and set them via KVs in a file with `--remove-all-tags --import-tags-from=-` and piping the templated file into the command.
2. MP3, we use <https://pkg.go.dev/github.com/bogem/id3v2/v2>, which conveniently works without shell escapes
3. AAC, we rely on `ffmpeg`'s <https://wiki.multimedia.cx/index.php/FFmpeg_Metadata#QuickTime/MOV/MP4/M4A/et_al.>

> WAV is not supported for metadata addition, it is only used for transcoding, because WAV is a mess and
> we seem to not find examples of people providing libraries for this. Writing this from scratch exceeds
> the scope.

> This means that we implicitly require a shell, so distroless images are out of question
