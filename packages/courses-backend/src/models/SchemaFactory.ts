import { AuditEntity } from "@course/common";
import mongoose, { Schema, SchemaDefinition, SchemaOptions } from "mongoose";

export const SchemaFactory = <T extends AuditEntity>(
  obj: SchemaDefinition
): Schema<T> => {
  return new mongoose.Schema<T>(auditFields, customSchemaOptions)
    .pre("save", addAudit)
    .add(obj);
};

const customSchemaOptions: SchemaOptions = {
  versionKey: "version",
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
    },
  },
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
    },
  },
};

const auditFields = {
  createdAt: {
    type: Date,
    required: false,
  },
  modifiedAt: {
    type: Date,
    required: false,
  },
};

function addAudit<T extends AuditEntity>(this: T): void {
  if (this) {
    const now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.modifiedAt = now;
  }
}
