import { AuditEntity } from "./AuditEntity";
import { Entity } from "./Entity";
import { User } from "./User";

export interface ClassMaterial extends AuditEntity, Entity {
  content: string;
  author: User;
}
