import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { Namespace } from './namespaces/entities/namespace.model';
import { Theme } from './themes/entities/theme.model';
import { Track } from './tracks/entities/track.model';
import { Waveform } from './waveforms/entities/waveform.model';
import { v5 as uuidv5 } from 'uuid';

export interface IResourceMetadata {
  name: string;
  createdAt: number;
  updatedAt: number;
  uuid: string;
  revision: number;
}

/**
 * Default class for all objects inside a namespace
 */
export interface INamespacedResourceMetadata extends IResourceMetadata {
  namespace: string;
  ownerReference: ObjectID;
}

export class NamespacedResourceMetadata implements INamespacedResourceMetadata {
  @Column()
  name: string;

  @Column()
  namespace: string;

  @CreateDateColumn()
  createdAt: number;

  @UpdateDateColumn()
  updatedAt: number;

  @VersionColumn()
  revision: number;

  @Column()
  ownerReference: ObjectID;

  @Column()
  uuid: string;

  constructor(name: string, namespace: string, ownerReference: ObjectID) {
    this.name = name;
    this.namespace = namespace;
    this.ownerReference = ownerReference;
    this.uuid = uuidv5(this.name, uuidv5.DNS);
  }
}

export class ResourceMetadata implements IResourceMetadata {
  @Column()
  name: string;

  @Column()
  namespace: string;

  @CreateDateColumn()
  createdAt: number;

  @UpdateDateColumn()
  updatedAt: number;

  @VersionColumn()
  revision: number;

  @Column()
  uuid: string;

  constructor(name: string) {
    this.name = name;
    this.uuid = uuidv5(this.name, uuidv5.DNS);
  }
}

export class ResourceSpec {}

export class GlobalResourceMetadata extends ResourceMetadata {}

export class Resource {
  @ObjectIdColumn()
  id: ObjectID;

  @Column(() => String)
  kind: string;

  @Column(() => ResourceMetadata)
  metadata: ResourceMetadata;

  @Column(() => ResourceSpec)
  spec: ResourceSpec;

  @BeforeUpdate()
  updateMetadata() {
    this.metadata.updatedAt = Date.now();
    this.metadata.revision += 1;
  }
}

/**
 * Similar to namespaced objects, except the missing namespace and ownership reference. Used for namespaces, mostly
 */

export const supportedResources = [
  Namespace.name,
  Track.name,
  Theme.name,
  Waveform.name,
];
