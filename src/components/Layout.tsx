import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { TopHeader } from './TopHeader'

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background selection:bg-primary/30 selection:text-primary">
        <AppSidebar />
        <SidebarInset className="bg-transparent flex flex-col flex-1 overflow-hidden">
          <TopHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-slide-in-right">
            <div className="mx-auto max-w-6xl">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
