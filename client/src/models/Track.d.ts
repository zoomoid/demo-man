interface General {
  title: string;
  artist: string;
  albumartist: string;
  album: string;
  year: number | string;
  no: number;
  genre: string[];
  composer: string[];
  comment: string[];
  duration: number;
  bpm: number;
}

interface File {
  sr: number;
  bitrate: number;
  path: string;
  directory: string;
  name: string;
  mp3: string;
}

interface Metadata {
  name: string;
  namespace: string;
}

interface Cover {
  mimeType: string;
  publicUrl: string;
  localUrl: string;
  filename: string;
}

interface Track {
  general: General;
  file: File;
  metadata: Metadata;
  cover: Cover;
}

interface TrackAPIResource {
  links: {
    self: string;
    waveform: string;
    namespace: string;
    cover: string;
  };
  _id: string;
  type: "Track";
  metadata: {
    namespace: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    lastAppliedConfiguration: string;
  };
  data: {
    general: General;
    file: File;
    cover: Cover;
  };
}

export { Track, General, File, Metadata, Cover, TrackAPIResource };
