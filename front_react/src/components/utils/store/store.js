import { create } from "zustand";

const useApplicationStore = create((set) => ({
    isAuthenticated: false,
    signIn: () => set({ isAuthenticated: true }),
    logOut: () => set({ isAuthenticated: false }),
}));

export default useApplicationStore;
