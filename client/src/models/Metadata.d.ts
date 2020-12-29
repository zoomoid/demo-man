import type { Link } from "./Namespace";

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

export { MetadataAPIResource };
