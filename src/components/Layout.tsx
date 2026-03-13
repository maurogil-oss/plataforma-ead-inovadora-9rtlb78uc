import { Outlet, Navigate } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { TopHeader } from './TopHeader'
import { useAuthStore } from '@/stores/authStore'

export default function Layout() {
  const user = useAuthStore((s) => s.user)

  if (!user) return <Navigate to="/login" replace />

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="bg-transparent flex flex-col flex-1 overflow-hidden min-w-0">
          <TopHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
