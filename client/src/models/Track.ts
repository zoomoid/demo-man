import { APIResource } from "./APIResource";
import { DataModel } from "./DataModel";

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
 * API Model of the track resource
 */
interface TrackAPIResource extends APIResource {
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

class Track extends DataModel {
  private _general: General;
  private _cover: Cover;
  private _file: File;
  private _metadata: Metadata;

  constructor(resource: TrackAPIResource) {
    super(resource);
    this._general = resource.data.general;
    this._cover = resource.data.cover;
    this._file = resource.data.file;
    this._metadata = {
      name: resource.metadata.name,
      namespace: resource.metadata.namespace,
    };
  }

  get() {
    return {
      general: this._general,
      cover: this._cover,
      file: this._file,
      metadata: this._metadata,
    };
  }

  public get general() {
    return this._general;
  }

  public get cover() {
    return this._cover;
  }

  public get file() {
    return this._file;
  }

  public get metadata() {
    return this._metadata;
  }
}

export { Track, General, File, Metadata, Cover, TrackAPIResource };
