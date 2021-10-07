/**
 * Converts a duration in seconds to a human readable timestamp
 * @param val duration in seconds
 */
export default function toTime(val: number): string {
  try {
    const hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
    return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
  } catch (e) {
    return "00:00";
  }
}
