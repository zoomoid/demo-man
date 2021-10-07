/**
 * Converts an RGB color tuple given as string with ", " as separator to a hexadecimal color representation
 * @param color rgb color tuple string
 */
export default function toHexString(color: string): string {
  return color
    .split(", ")
    .map((c) => parseInt(c, 10).toString(16))
    .reduce((p, c) => p + c);
}
