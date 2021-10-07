/**
 * Converts an RGB tuple into a string representation for usage with CSS variables
 * @param theme 3-tuple of RGB color as array of numbers
 * @param computed 3-tuple of RGB color as array of numbers
 * @param defaultValue optional default color
 */
export default function toCSSColorString(
  theme?: number[],
  computed?: number[],
  defaultValue?: string
): string {
  if (theme) {
    return `${theme[0]}, ${theme[1]}, ${theme[2]}`;
  } else {
    if (computed) {
      return `${computed[0]}, ${computed[1]}, ${computed[2]}`;
    } else {
      if (defaultValue) {
        return defaultValue;
      } else {
        return "";
      }
    }
  }
}
