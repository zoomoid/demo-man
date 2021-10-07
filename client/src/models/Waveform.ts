import { APIResource } from "./APIResource";
import { DataModel } from "./DataModel";

/**
 * API Model of the waveform resource
 */
interface WaveformAPIResource extends APIResource {
  links: {
    self: string;
    track: string;
    full: string;
    small: string;
  };
  _id: string;
  type: "Waveform";
  metadata: {
    namespace: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    revision: number;
    lastAppliedConfiguration: string;
  };
  data: {
    full: string;
    small: string;
  };
}

class Waveform extends DataModel {
  private _full: string;
  private _small: string;
  constructor(resource: WaveformAPIResource) {
    super(resource);

    this._full = resource.data.full;
    this._small = resource.data.small;
  }

  get() {
    return {
      full: this._full,
      small: this._small,
    };
  }

  public get full() {
    return this._full;
  }

  public get small() {
    return this._small;
  }
}

export { WaveformAPIResource, Waveform };
