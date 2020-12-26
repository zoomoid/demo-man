from functools import reduce


def rel_luminance(color: tuple) -> float:
    """Calculates the relative luminance of a given color as either list or tuple
    according to https://www.w3.org/TR/WCAG20/#relativeluminancedef
    
    :param color: 8-bit color as 3-tuple
    :type color: tuple
    :returns: relative luminance of color
    :rtype: float
    """
    color = list(map(lambda c: c / 255, color))
    color = list(map(lambda c: c / 12.92 if c <=
                     0.03928 else ((c + 0.055)/1.055) ** 2.4, color))
    color = list(zip([0.2126, 0.7152, 0.0722], color))
    return reduce((lambda x, y: (float(y[0]) * float(y[1])) + x), color, 0)


def contrast_ratio(c1: tuple, c2: tuple) -> float:
    """Computes the contrast ratio of two colors according to
    https://www.w3.org/TR/WCAG20/#contrast-ratiodef

    :param c1: 8-bit color as 3-tuple
    :type c1: tuple
    :param c2: 8-bit color as 3-tuple
    :type c2: tuple
    :returns: constrast ratio in [1,21]
    :rtype: float
    """
    luminance = list(map(lambda c: rel_luminance(c), [c1, c2]))
    # print(luminance)
    if(luminance[0] >= luminance[1]):
        return (luminance[0] + 0.05) / (luminance[1] + 0.05)
    else:
        return (luminance[1] + 0.05) / (luminance[0] + 0.05)


def determine_text_color(color: tuple) -> tuple:
    """Determines the correct text color (either black or white), according to
    https://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast and the
    contrast ratio of the two colors.

    :param color -- 8bit color as 3-tuple
    :type color: tuple
    :return: either white or black, as 8bit color tuple
    :rtype: tuple
    """
    white = (255, 255, 255)
    black = (0, 0, 0)
    ratioWhite = contrast_ratio(color, white)
    ratioBlack = contrast_ratio(color, black)
    if(ratioBlack > ratioWhite):
        return white
    else:
        return black
