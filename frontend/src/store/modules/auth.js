const auth = (set) => ({
  auth: {
    isAuthenticated: !!sessionStorage.getItem("jwt"),
    signIn: () => set((state) => ({ auth: { ...state.auth, isAuthenticated: true } })),
    logOut: () => set((state) => ({ auth: { ...state.auth, isAuthenticated: false } })),
  },
});

export default auth;