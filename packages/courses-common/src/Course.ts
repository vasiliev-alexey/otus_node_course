import { AuditEntity } from "./AuditEntity";
import { Entity } from "./Entity";

export interface Course extends AuditEntity, Entity {
  title: string;
  description: string;
  authorName: string;
  imageString?: string;
}
