import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'manager'
  avatar?: string
}

interface AuthStore {
  user: User | null
  login: (role: 'student' | 'manager') => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: (role) =>
    set({
      user: {
        id: role === 'manager' ? 'm1' : 's1',
        name: role === 'manager' ? 'Admin Gestor' : 'João Silva',
        email: `${role}@empresa.com`,
        role,
        avatar: `https://img.usecurling.com/ppl/thumbnail?seed=${role}`,
      },
    }),
  logout: () => set({ user: null }),
}))
