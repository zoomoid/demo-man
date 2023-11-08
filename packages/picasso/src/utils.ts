type color = [number, number, number];

export const black: color = [0, 0, 0]
export const white: color = [255, 255, 255]

/**
 * Determines the correct text color (either black or white), according to 
 * https://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast and the 
 * contrast ratio of the two colors.
 * 
 * @param color primary color to compute contrast ratios for
 * @returns either black or white as a color type ([number,number,number]).
 */
export function calculateTextColor(color: color): color {
  const [rb, rw] = [contrastRatio(color, black), contrastRatio(color, white)]
  if (rb < rw) {
    return white
  } else {
    return black
  }
}

/**
 * Computes the contrast ratio of two colors according to 
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 * 
 * @param primary 8-bit color as 3-tuple
 * @param comparator 8-bit color as 3-tuple to compare against primary color
 * @returns contrast ratio between primary color and comparator color
 */
function contrastRatio(primary: color, comparator: color): number {
  const [primaryLuminance, compLuminance] = [
    relativeLuminance(primary),
    relativeLuminance(comparator)
  ]

  if (primaryLuminance >= compLuminance) {
    return (primaryLuminance + 0.05) / (compLuminance + 0.05)
  } else {
    return (compLuminance + 0.05) / (primaryLuminance + 0.05)
  }
}

/**
 * Calculates the relative luminance of a given color as either list or 
 * tuple according to https://www.w3.org/TR/WCAG20/#relativeluminancedef
 * 
 * @param color 8-bit color as 3-tuple
 * @returns relative luminance of color
 */
function relativeLuminance(color: color): number {
  let c = color
    .map((c) => c / 255)
    .map((c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)) as color

  const w = [0.2126, 0.7152, 0.0722]
  return c.map((c, i) => [c, w[i]]).reduce((p, [c, w]) => p + (c * w), 0)
}

export function toString(c: color): string {
  return `${c[0], c[1], c[2]}`
}
