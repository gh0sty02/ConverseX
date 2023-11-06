import { create } from "zustand";

// When a button is clicked, the "onClick" handler calls the "onOpen" function with the type of the modal to be
// rendered, such as "CreateServer." This sets the "isOpen" flag to "true" and updates the "type". Subsequently, we
// check if "isOpen" is "true" and whether the "type" matches the modal to be rendered (in this case, "CreateServer").
// If both conditions are satisfied, we render the modal.

// modal types will determine what kind of modal has to be rendered
export type ModalType = "createServer";

// create a app wide zustand store to store a set of functions for managing modal-related state
interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

// creates a new store of type "ModalStore" and set initial state
export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ isOpen: true, type }),
  onClose: () => set({ type: null, isOpen: false }),
}));
