import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

// When a button is clicked, the "onClick" handler calls the "onOpen" function with the type of the modal to be
// rendered, such as "CreateServer." This sets the "isOpen" flag to "true" and updates the "type". Subsequently, we
// check if "isOpen" is "true" and whether the "type" matches the modal to be rendered (in this case, "CreateServer").
// If both conditions are satisfied, we render the modal.

// modal types will determine what kind of modal has to be rendered
export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage";

interface ModalData {
  server?: Server;
  channelType?: ChannelType;
  channel?: Channel;
  apiUrl?: string;
  query?: Record<string, any>;
}

// create a app wide zustand store to store a set of functions for managing modal-related state
interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  isCreateServerImageLoading: boolean; // New property
  setIsCreateServerImageLoading: (loading: boolean) => void; // New function
  onOpen: (type: ModalType, data?: ModalData) => void;

  onClose: () => void;
}

// creates a new store of type "ModalStore" and set initial state
export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  isCreateServerImageLoading: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
  setIsCreateServerImageLoading: (loading) =>
    set({ isCreateServerImageLoading: loading }),
}));
