import { AuditEntity } from "./AuditEntity";
import { Entity } from "./Entity";

export interface Lesson extends AuditEntity, Entity {
  topic: string;
}
