interface Link {
  label: string;
  link: string;
}

interface Namespace {
  name: string;
  description: string;
  links: Link[];
  title: string;
}

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
  data: {
    description: string;
    links: Link[];
    title: string;
  };
}

export { Namespace, NamespaceAPIResource, Link };
