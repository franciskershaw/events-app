import { createContext, ReactNode, useContext, useReducer } from "react";

import { Event } from "@/types/globalTypes";

// Define modal names as constants
const MODAL_EVENT = "event";

type ModalMode = "edit" | "copy" | "addFromFreeEvent";

type ModalsState = {
  isEventModalOpen: boolean;
  isDeleteEventModalOpen: boolean;
  selectedEvent: Event | null;
  mode: ModalMode | null;
};

// Define the actions type
type ModalsAction =
  | { type: "OPEN_EVENT_MODAL"; data?: Event; mode: ModalMode }
  | { type: "OPEN_DELETE_EVENT_MODAL"; data: Event }
  | { type: "CLOSE_MODAL" }
  | { type: "RESET_SELECTED_DATA" };

// Initial state for the reducer
const initialState: ModalsState = {
  isEventModalOpen: false,
  isDeleteEventModalOpen: false,
  selectedEvent: null,
  mode: null,
};

// Reducer function
const modalsReducer = (
  state: ModalsState,
  action: ModalsAction
): ModalsState => {
  switch (action.type) {
    case "OPEN_EVENT_MODAL":
      return {
        ...state,
        isEventModalOpen: true,
        selectedEvent: action.data || null,
        mode: action.mode,
      };
    case "OPEN_DELETE_EVENT_MODAL":
      return {
        ...state,
        isDeleteEventModalOpen: true,
        selectedEvent: action.data,
      };

    case "CLOSE_MODAL":
      return {
        ...state,
        isEventModalOpen: false,
        isDeleteEventModalOpen: false,
        mode: null,
      };

    case "RESET_SELECTED_DATA":
      return {
        ...state,
        selectedEvent: null,
        mode: null,
      };

    default:
      return state;
  }
};

// Context type definition
type ModalsContextType = ModalsState & {
  openEventModal: (data?: Event, mode?: ModalMode) => void;
  openDeleteEventModal: (data: Event) => void;
  closeModal: () => void;
  resetSelectedData: () => void;
};

// Create context
const ModalsContext = createContext<ModalsContextType | undefined>(undefined);

// Provider component
const ModalsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(modalsReducer, initialState);

  // Action dispatchers
  const openEventModal = (data?: Event, mode: ModalMode = "edit") => {
    dispatch({ type: "OPEN_EVENT_MODAL", data, mode });
  };

  const openDeleteEventModal = (data: Event) => {
    dispatch({ type: "OPEN_DELETE_EVENT_MODAL", data });
  };

  const closeModal = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  const resetSelectedData = () => {
    dispatch({ type: "RESET_SELECTED_DATA" });
  };

  return (
    <ModalsContext.Provider
      value={{
        ...state,
        openEventModal,
        openDeleteEventModal,
        closeModal,
        resetSelectedData,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
};

// Custom hook to use the Modals context
const useModals = () => {
  const context = useContext(ModalsContext);
  if (!context) {
    throw new Error("useModals must be used within a ModalsProvider");
  }
  return context;
};

export { MODAL_EVENT, ModalsProvider, useModals };
