import { Metadata } from "./Metadata";

/**
 * Link interface for links created from metadata files
 */
interface Link {
  label: string;
  link: string;
}

/**
 * Namespace holding interface, contains all descriptive features of a namespace
 */
interface Namespace {
  name: string;
  description: string;
  links: Link[];
  title: string;
}

/**
 * API Model of the namespace resource
 */
interface NamespaceAPIResource {
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
  data: Metadata;
}

const fromAPIResource = (n: NamespaceAPIResource): Namespace => {
  return {
    name: n.metadata.name,
    description: n.data.description,
    title: n.data.description,
    links: n.data.links
  };
};

export { Namespace, NamespaceAPIResource, Link, fromAPIResource };
