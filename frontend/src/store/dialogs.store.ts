import { create } from "zustand";

interface DialogsState {
  openCreateProjectDialog: boolean;
  setOpenCreateProjectDialog: (open: boolean) => void;
}

export const useDialogsStore = create<DialogsState>((set) => ({
  openCreateProjectDialog: false,
  setOpenCreateProjectDialog: (open: boolean) =>
    set({ openCreateProjectDialog: open }),
}));
