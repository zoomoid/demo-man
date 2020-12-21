from functools import reduce

"""
Calculates the relative luminance of a given color as either list or tuple
according to https://www.w3.org/TR/WCAG20/#relativeluminancedef
"""
def rel_luminance(color):
  color = list(map(lambda c: c / 255, color))
  color = list(map(lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055)/1.055) ** 2.4, color))
  color = list(zip([0.2126, 0.7152, 0.0722], color))
  return reduce((lambda x, y: (float(y[0]) * float(y[1])) + x), color, 0)

"""
Computes the contrast ratio of two colors according to
https://www.w3.org/TR/WCAG20/#contrast-ratiodef
"""
def contrast_ratio(c1, c2):
  luminance = list(map(lambda c: rel_luminance(c), [c1, c2]))
  print(luminance)
  if(luminance[0] >= luminance[1]):
    return (luminance[0] + 0.05) / (luminance[1] + 0.05)
  else:
    return (luminance[1] + 0.05) / (luminance[0] + 0.05)

