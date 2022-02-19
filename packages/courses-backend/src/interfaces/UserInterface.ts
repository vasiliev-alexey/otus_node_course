import { AuditEntity } from "@course/common";

export interface UserInterface {
  username: string;
  isAdmin?: boolean;
  id: string;
}

export interface DatabaseUserInterface extends AuditEntity {
  username: string;
  password: string;
  isAdmin: boolean;
  id: string;
}
