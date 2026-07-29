export const queryKeys = {
  auth: {
    me: ["me"] as const,
  },

  projects: {
    all: ["projects"] as const,
    details: (id: string) => ["projects", id] as const,
  },

  tasks: {
    all: (projectId: string) => ["projects", projectId, "tasks"] as const,
  },
};
