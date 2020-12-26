import { Track } from "./Track";

type QueueStatePaused = {
  state: "paused";
  index: number;
};

type QueueStatePlaying = {
  state: "playing";
  index: number;
};

type QueueStateStopped = {
  state: "stopped";
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
