import mongoose, { Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description?: string;

  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema<IProject>(
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

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

projectSchema.index({ owner: 1 });
projectSchema.index({ members: 1 });

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;
