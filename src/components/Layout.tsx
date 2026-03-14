import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { TopHeader } from './TopHeader'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

export default function Layout() {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  const isStudentDashboard = location.pathname === '/student/dashboard'

  if (!user) return <Navigate to="/login" replace />

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background dark:bg-slate-950 font-sans">
        <AppSidebar />
        <SidebarInset className="bg-transparent flex flex-col flex-1 overflow-hidden min-w-0 transition-all duration-300">
          <TopHeader />
          <main
            className={cn(
              'flex-1 overflow-y-auto',
              isStudentDashboard ? 'p-0 md:p-0' : 'p-4 md:p-8',
            )}
          >
            <div className={cn('mx-auto w-full', isStudentDashboard ? 'max-w-full' : 'max-w-7xl')}>
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
