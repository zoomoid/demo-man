/**
 * General track information from the mp3
 */
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

/**
 * File-related information
 */
interface File {
  sr: number;
  bitrate: number;
  path: string;
  directory: string;
  name: string;
  mp3: string;
}

/**
 * Abbreviated Resource metadata
 */
interface Metadata {
  name: string;
  namespace: string;
}

/**
 * Cover-related information
 */
interface Cover {
  mimeType: string;
  publicUrl: string;
  localUrl: string;
  filename: string;
}

/**
 * Composed Track resource
 */
interface Track {
  general: General;
  file: File;
  metadata: Metadata;
  cover: Cover;
}

/**
 * API Model of the track resource
 */
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

const fromAPIResource = (t: TrackAPIResource): Track => {
  return {
    general: t.data.general,
    cover: t.data.cover,
    file: t.data.file,
    metadata: {
      name: t.metadata.name,
      namespace: t.metadata.namespace
    }
  };
};

export { Track, General, File, Metadata, Cover, TrackAPIResource, fromAPIResource };
