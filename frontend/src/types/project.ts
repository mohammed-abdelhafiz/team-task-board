import type { User } from "./auth";

export type Project = {
  _id: string;
  title: string;
  description: string;
  owner: User;
  members: string[];
  createdAt: string;
  updatedAt: string;
};
