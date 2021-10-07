import { APIResource } from "./APIResource";

export abstract class DataModel implements APIResource {
  private _apiResource?: APIResource;
  private _pending: boolean;

  constructor(apiResource?: APIResource) {
    if (apiResource) {
      this._apiResource = apiResource;
      this._pending = false;
    } else {
      this._pending = true;
      this._apiResource = undefined;
    }
  }

  public get $pending() {
    return this._pending;
  }

  public get $resource() {
    return this._apiResource;
  }

  abstract get(): Record<string, any>;
}
