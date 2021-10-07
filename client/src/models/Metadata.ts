import { APIResource } from "./APIResource";
import { DataModel } from "./DataModel";
import { Link } from "./Namespace";

/**
 * API Model of the metadata resource
 */
interface MetadataAPIResource extends APIResource {
  links: {
    self: string;
    namespace: string;
  };
  id: string;
  type: "Metadata";
  isPseudoResource: boolean;
  metadata: {
    namespace: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    revision: number;
    lastAppliedConfiguration: string;
  };
  data: {
    description: string;
    links: Link[];
    title: string;
  };
}

class Metadata extends DataModel {
  private _title: string = "";
  private _description: string = "";
  private _links: Link[] = [];

  constructor(resource?: MetadataAPIResource) {
    super(resource);
    if (resource) {
      this._title = resource.data.title;
      this._description = resource.data.description;
      this._links = resource.data.links;
    }
  }

  get() {
    return {
      title: this._title,
      description: this._description,
      links: this._links,
    };
  }

  public get title(){
    return this._title;
  }

  public get description(){
    return this._description;
  }

  public get links(){
    return this._links;
  }
}

export { MetadataAPIResource, Metadata };
