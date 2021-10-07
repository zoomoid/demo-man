import { APIResource } from "./APIResource";
import { DataModel } from "./DataModel";

const defaultTheme: ThemeModel = {
  accent: [245, 139, 68], // #F58B44,
  color: [255, 255, 255], // #FFFFFF
  textColor: [26, 26, 26], // #1A1A1A
};
const defaultComputedTheme: ComputedThemeModel = {
  accent: [245, 139, 68], // #F58B44,
  color: [255, 255, 255], // #FFFFFF
  textColor: [26, 26, 26], // #1A1A1A
  palette: [],
};

/**
 * API Resource of the theme resource
 */
interface ThemeAPIResource extends APIResource {
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
    theme?: ThemeModel;
    computedTheme?: ComputedThemeModel;
  };
}

interface ThemeModel {
  color: number[];
  textColor: number[];
  accent: number[];
}

interface ComputedThemeModel extends ThemeModel {
  palette?: number[][];
}

class Theme extends DataModel {

  private _theme?: ThemeModel;
  private _computedTheme: ComputedThemeModel;

  constructor(resource?: ThemeAPIResource) {
    super(resource);
    if (resource?.data.theme) {
      this._theme = {
        ...resource.data.theme,
      };
    }
    if (resource?.data.computedTheme) {
      this._computedTheme = {
        ...resource.data.computedTheme,
      };
    } else {
      this._computedTheme = defaultComputedTheme;
    }
  }

  /**
   * if theme override is set, return user-specified theme, otherwise use computed one
   */
  get() {
    if (this._theme) {
      return this._theme;
    } else {
      return this._computedTheme;
    }
  }

  public get theme() {
    return this._theme;
  }

  public get computedTheme() {
    return this._computedTheme;
  }
}

export { Theme, ThemeAPIResource, ThemeModel, ComputedThemeModel };
