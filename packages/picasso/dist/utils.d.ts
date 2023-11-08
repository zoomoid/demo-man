type color = [number, number, number];
export declare const black: color;
export declare const white: color;
/**
 * Determines the correct text color (either black or white), according to
 * https://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast and the
 * contrast ratio of the two colors.
 *
 * @param color primary color to compute contrast ratios for
 * @returns either black or white as a color type ([number,number,number]).
 */
export declare function calculateTextColor(color: color): color;
export declare function toString(c: color): string;
export {};
