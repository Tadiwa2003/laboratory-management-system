import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: (user, token) => {
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  updateUser: (userData) => {
    set((state) => ({
      user: { ...state.user, ...userData },
    }));
  },
}));

export default useAuthStore;

