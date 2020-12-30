/**
 * API Model of the waveform resource
 */
interface WaveformAPIResource {
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

export { WaveformAPIResource };
