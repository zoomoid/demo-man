export interface General {
  title: string,
  artist: string,
  albumartist: string,
  year: number | string,
  no: number,
  genre: string[],
  composer: string[],
  comment: string[],
  duration: number,
}

export interface File {
  sr: number,
  bitrate: number,
  path: string,
  directory: string,
  name: string,
  mp3: string,
}

export interface Metadata {
  name: string,
  metadata: string
}

export interface Cover {
  mimeType: string,
  publicUrl: string,
  localUrl: string,
  filename: string
}

export interface Track {
  general: General,
  file: File,
  metadata: Metadata,
  Cover: Cover,
}
