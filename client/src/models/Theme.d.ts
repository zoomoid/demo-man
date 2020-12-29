interface Theme {
  color: string;
  textColor: string;
  accent: string;
}

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
    theme?: {
      accent: string | number[];
      color: string | number[];
      textColor: string | number[];
    };
    computedTheme?: {
      accent: number[];
      color: number[];
      textColor: number[];
      palette: number[][];
    };
  };
}

export { Theme, ThemeAPIResource };
