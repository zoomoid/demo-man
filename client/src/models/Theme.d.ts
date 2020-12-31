/**
 * Interface for holding theme data
 */
interface Theme {
  color: number[];
  textColor: number[];
  accent: number[];
}

interface ThemeProp {
  color: string;
  textColor: string;
  accent: string;
  palette?: string[];
}

interface ComputedTheme extends Theme {
  palette?: number[][];
}

/**
 * API Resource of the theme resource
 */
interface ThemeAPIResource {
  links: {
    self: string;
    namespace: string;
  };
  _id: string;
  type: "Theme";
  metadata: {
    namespace: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    revision: number;
    lastAppliedConfiguration: string;
  };
  data: {
    theme?: Theme;
    computedTheme?: ComputedTheme;
  };
}

const fromAPIResource = (t: ThemeAPIResource, key: "computed" | "theme"): Theme => {
  if (key === "computed") {
    return t.data.computedTheme;
  } else {
    return t.data.theme;
  }
};

export { Theme, ComputedTheme, ThemeAPIResource, ThemeProp, fromAPIResource };
