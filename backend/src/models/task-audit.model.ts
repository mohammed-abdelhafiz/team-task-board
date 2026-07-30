import mongoose, { Document, Types } from "mongoose";
import { TaskStatus } from "@/constants/enums";

export interface ITaskAudit extends Document {
  task: Types.ObjectId;
  project: Types.ObjectId;
  changedBy: Types.ObjectId;
  fromStatus?: TaskStatus;
  toStatus: TaskStatus;
  createdAt: Date;
}

const taskAuditSchema = new mongoose.Schema<ITaskAudit>(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fromStatus: { type: String, enum: Object.values(TaskStatus) },
    toStatus: { type: String, enum: Object.values(TaskStatus), required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

taskAuditSchema.index({ task: 1, createdAt: -1 });

export default mongoose.model<ITaskAudit>("TaskAudit", taskAuditSchema);
