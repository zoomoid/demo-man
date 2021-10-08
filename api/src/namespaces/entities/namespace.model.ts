import {
  BeforeUpdate,
  Column,
  Entity,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import { GlobalResourceMetadata, Resource } from '../../objects';

export class NamespaceMetadata extends GlobalResourceMetadata {}

@Entity()
export class Namespace extends Resource {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({
    type: String,
    default: 'Namespace',
  })
  kind: string;

  @Column(() => NamespaceMetadata)
  metadata: NamespaceMetadata;

  @BeforeUpdate()
  updateMetadata() {
    this.metadata.updatedAt = Date.now();
    this.metadata.revision += 1;
  }
}
