import { Track } from "./Track";

type QueueStatePaused = {
  type: "paused";
  index: number;
};

type QueueStatePlaying = {
  type: "playing";
  index: number;
};

type QueueStateStopped = {
  type: "stopped";
  finished: boolean;
  started: boolean;
};

type QueueState = QueueStatePlaying | QueueStatePaused | QueueStateStopped;

interface Cover {
  url?: string;
}

interface Queue {
  tracks: Track[];
  autoplay: true;
  loop: false;
  cover: Cover;
  state: QueueState;
}
