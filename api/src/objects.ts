/**
 * Default class for all objects inside a namespace
 */
export class NamespacedObjectMetadata {
  name: string;
  namespace: string;
  createdAt: string;
  updatedAt: string;
  uuid: string;
  revision: number;
  ownerReference: string;
}

/**
 * Similar to namespaced objects, except the missing namespace and ownership reference. Used for namespaces, mostly
 */
export class GlobalObjectMetadata {
  name: string;
  createdAt: string;
  updatedAt: string;
  uuid: string;
  revision: number;
}
