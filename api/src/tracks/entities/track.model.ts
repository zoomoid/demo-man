import { NamespacedResourceMetadata, Resource } from '../../objects';
import * as typeorm from 'typeorm';

export class TrackMetadata extends NamespacedResourceMetadata {}

export class TrackGeneralSpec {
  @typeorm.Column()
  title: string;

  @typeorm.Column()
  artist: string;

  @typeorm.Column()
  albumartist: string;

  @typeorm.Column()
  album: string;

  @typeorm.Column()
  no: string | number;

  @typeorm.Column()
  genre: string;

  @typeorm.Column()
  composer: string;

  @typeorm.Column()
  comment: string;

  @typeorm.Column()
  bpm: string | number;

  @typeorm.Column()
  duration: number;

  constructor(
    title: string,
    artist: string,
    albumartist: string,
    album: string,
    no: string | number,
    composer: string,
    comment: string,
    bpm: string | number,
    duration: number,
  ) {
    this.title = title;
    this.artist = artist;
    this.albumartist = albumartist;
    this.album = album;
    this.no = no;
    this.composer = composer;
    this.comment = comment;
    this.bpm = bpm;
    this.duration = duration;
  }
}

export class TrackFileSpec {
  @typeorm.Column()
  sr: number;

  @typeorm.Column()
  bitrate: number;

  @typeorm.Column()
  path: string;

  @typeorm.Column()
  directory: string;

  @typeorm.Column()
  name: string;

  @typeorm.Column()
  mp3: string;

  constructor(
    sr: number,
    bitrate: number,
    path: string,
    directory: string,
    name: string,
    mp3: string,
  ) {
    this.sr = sr;
    this.bitrate = bitrate;
    this.path = path;
    this.directory = directory;
    this.name = name;
    this.mp3 = mp3;
  }
}

export class TrackCoverSpec {
  @typeorm.Column()
  mimeType: string;

  @typeorm.Column()
  publicUrl: string;

  @typeorm.Column()
  localUrl: string;

  @typeorm.Column()
  filename: string;

  constructor(
    mimeType: string,
    publicUrl: string,
    localUrl: string,
    filename: string,
  ) {
    this.mimeType = mimeType;
    this.publicUrl = publicUrl;
    this.localUrl = localUrl;
    this.filename = filename;
  }
}

export class TrackSpec {
  @typeorm.Column(() => TrackGeneralSpec)
  general: TrackGeneralSpec;

  @typeorm.Column(() => TrackFileSpec)
  file: TrackFileSpec;

  @typeorm.Column(() => TrackCoverSpec)
  cover: TrackCoverSpec;

  constructor(
    general: TrackGeneralSpec,
    file: TrackFileSpec,
    cover: TrackCoverSpec,
  ) {
    this.general = general;
    this.file = file;
    this.cover = cover;
  }
}

@typeorm.Entity()
export class Track extends Resource {
  @typeorm.Column({
    type: String,
    default: 'Track',
  })
  kind: string;

  @typeorm.Column(() => TrackMetadata)
  metadata: TrackMetadata;

  @typeorm.Column(() => TrackSpec)
  spec: TrackSpec;
}
