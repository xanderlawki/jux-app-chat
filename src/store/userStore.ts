import { create } from "zustand";

interface UserState {
  username: string | null;
  setUsername: (username: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  username: null,
  setUsername: (username) => set({ username }),
}));

export default useUserStore;
