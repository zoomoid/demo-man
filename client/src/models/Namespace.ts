import { APIResource } from "./APIResource";
import { DataModel } from "./DataModel";
import { Metadata } from "./Metadata";

/**
 * Link interface for links created from metadata files
 */
interface Link {
  label: string;
  link: string;
}

/**
 * API Model of the namespace resource
 */
interface NamespaceAPIResource extends APIResource {
  links: {
    self: string;
    cover: string;
    theme: string;
    tracks: string;
    metadata: string;
    waveforms: string;
  };
  _id: string;
  type: "Namespace";
  metadata: {
    name: string;
    createdAt: string;
    updatedAt: string;
    revision: number;
    lastAppliedConfiguration: string;
  };
  data: {
    description: string;
    title: string;
    links: Link[];
  };
}

class Namespace extends DataModel {
  private _name: string = "";
  private _description: string = "";
  private _links: Link[] = [];
  private _title: string = "";

  constructor(resource?: NamespaceAPIResource) {
    super(resource);
    if (resource) {
      this._name = resource.metadata.name;
      this._description = resource.data.description;
      this._links = resource.data.links;
      this._title = resource.data.title;
    }
  }

  get() {
    return {
      name: this._name,
      description: this._description,
      title: this._title,
      links: this._links,
    };
  }

  public get title() {
    return this._title;
  }

  public get description() {
    return this._description;
  }

  public get links() {
    return this._links;
  }

  public get name() {
    return this._name;
  }
}

export { Namespace, NamespaceAPIResource, Link };
