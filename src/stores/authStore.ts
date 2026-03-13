import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'student' | 'manager' | 'instructor'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthStore {
  user: User | null
  login: (role: UserRole) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (role) =>
        set({
          user: {
            id: role === 'manager' ? 'm1' : role === 'instructor' ? 'i1' : 's1',
            name:
              role === 'manager'
                ? 'Admin Gestor'
                : role === 'instructor'
                  ? 'Prof. Carlos Silva'
                  : 'João Aluno',
            email: `${role}@empresa.com`,
            role,
            avatar: `https://img.usecurling.com/ppl/thumbnail?seed=${role}`,
          },
        }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    },
  ),
)
