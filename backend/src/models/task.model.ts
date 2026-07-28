import mongoose, { Document, Types } from "mongoose";

import { TaskPriority, TaskStatus } from "@/constants/enums";

export interface ITask extends Document {
  title: string;
  description?: string;

  status: TaskStatus;
  priority: TaskPriority;

  project: Types.ObjectId;

  assignedTo?: Types.ObjectId;

  createdBy: Types.ObjectId;

  dueDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },

    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dueDate: Date,
  },
  {
    timestamps: true,
  },
);

taskSchema.index({ project: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;