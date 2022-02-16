import { AuditEntity } from "./AuditEntity";
import { Entity } from "./Entity";
import { User } from "./User";

export interface Course extends AuditEntity, Entity {
  title: string;
  user: User;
}
