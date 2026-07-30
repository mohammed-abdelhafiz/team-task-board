import assert from "node:assert/strict";
import test from "node:test";
import { Types } from "mongoose";
import { UserRole } from "@/constants/enums";
import { authorizeProjectManagement } from "@/utils/project-permission";
import { loginSchema, registerSchema } from "@/validators/auth.validator";
import { createProjectSchema } from "@/validators/project.validator";
import { createTaskSchema, taskQuerySchema, updateTaskSchema } from "@/validators/task.validator";

test("registration requires a valid email and strong minimum password length", () => {
  assert.throws(() => registerSchema.parse({ fullName: "Ada", email: "invalid", password: "123" }));
  assert.equal(registerSchema.parse({ fullName: "Ada Lovelace", email: "ada@example.com", password: "secret1" }).email, "ada@example.com");
});

test("login rejects malformed credentials", () => {
  assert.throws(() => loginSchema.parse({ email: "not-an-email", password: "secret1" }));
});

test("projects trim titles and reject short names", () => {
  assert.equal(createProjectSchema.parse({ title: "  Delivery  " }).title, "Delivery");
  assert.throws(() => createProjectSchema.parse({ title: "No" }));
});

test("task payload validates allowed fields and due dates", () => {
  assert.equal(createTaskSchema.parse({ title: "Ship feature", priority: "high", dueDate: "2026-08-01" }).priority, "high");
  assert.throws(() => createTaskSchema.parse({ title: "Ship feature", priority: "urgent" }));
});

test("task query applies safe pagination defaults", () => {
  assert.deepEqual(taskQuerySchema.parse({}), { page: 1, limit: 10, sort: "createdAt" });
  assert.equal(taskQuerySchema.parse({ page: "2", limit: "25", status: "done" }).page, 2);
});

test("only project owners and administrators can manage a project", () => {
  const ownerId = new Types.ObjectId();
  const project = { owner: ownerId } as never;
  assert.doesNotThrow(() => authorizeProjectManagement(project, { _id: ownerId, role: UserRole.MEMBER } as never));
  assert.doesNotThrow(() => authorizeProjectManagement(project, { _id: new Types.ObjectId(), role: UserRole.ADMIN } as never));
  assert.throws(() => authorizeProjectManagement(project, { _id: new Types.ObjectId(), role: UserRole.MEMBER } as never));
});

test("task updates accept status-only changes", () => {
  assert.equal(updateTaskSchema.parse({ status: "in_progress" }).status, "in_progress");
});
