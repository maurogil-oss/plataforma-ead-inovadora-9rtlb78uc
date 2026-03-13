import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import Layout from './components/Layout'
import Login from './pages/auth/Login'
import NotFound from './pages/NotFound'

import StudentDashboard from './pages/student/Dashboard'
import CoursePlayer from './pages/student/CoursePlayer'
import Certificate from './pages/student/Certificate'

import ManagerDashboard from './pages/manager/Dashboard'
import ManagerCourses from './pages/manager/Courses'
import CourseEditor from './pages/manager/CourseEditor'
import ManagerEnrollments from './pages/manager/Enrollments'

import { useAuthStore } from './stores/authStore'

const RootRedirect = () => {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'manager' ? '/manager' : '/student'} replace />
}

const RoleRoute = ({
  role,
  children,
}: {
  role: 'student' | 'manager'
  children: React.ReactNode
}) => {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) {
    return <Navigate to={user.role === 'manager' ? '/manager' : '/student'} replace />
  }
  return <>{children}</>
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <RoleRoute role="student">
              <Layout />
            </RoleRoute>
          }
        >
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/course/:id" element={<CoursePlayer />} />
          <Route path="/student/certificate/:id" element={<Certificate />} />
        </Route>

        <Route
          element={
            <RoleRoute role="manager">
              <Layout />
            </RoleRoute>
          }
        >
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/courses" element={<ManagerCourses />} />
          <Route path="/manager/courses/new" element={<CourseEditor />} />
          <Route path="/manager/courses/:id/edit" element={<CourseEditor />} />
          <Route path="/manager/enrollments" element={<ManagerEnrollments />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
