import { Link } from "./Namespace";

/**
 * Metadata interface for containing metadata client-side
 */
interface Metadata {
  title: string;
  description: string;
  links: Link[];
}

/**
 * API Model of the metadata resource
 */
interface MetadataAPIResource {
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

const fromAPIResource = (m: MetadataAPIResource): Metadata => {
  return {
    title: m.data.title,
    description: m.data.description,
    links: m.data.links
  }
}

export { MetadataAPIResource, Metadata, fromAPIResource };
