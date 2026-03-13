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
import Reports from './pages/manager/Reports'
import PaymentSettings from './pages/manager/PaymentSettings'
import NotificationSettings from './pages/manager/NotificationSettings'
import Integrations from './pages/manager/Integrations'
import StudentDetails from './pages/manager/StudentDetails'
import CommissionSettings from './pages/manager/CommissionSettings'
import FinancialReports from './pages/manager/FinancialReports'

import QuestionBank from './pages/shared/QuestionBank'
import PartnerDashboard from './pages/shared/PartnerDashboard'
import GradeExams from './pages/instructor/GradeExams'
import Revenue from './pages/instructor/Revenue'
import ValidateCertificate from './pages/public/ValidateCertificate'

import { useAuthStore, UserRole } from './stores/authStore'

// Affiliate tracking logic outside of component cycle to run early
const urlParams = new URLSearchParams(window.location.search)
const ref = urlParams.get('ref')
if (ref) {
  localStorage.setItem('lms_affiliate_ref', ref)
}

const RootRedirect = () => {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'student') return <Navigate to="/student" replace />
  if (user.role === 'instructor') return <Navigate to="/instructor" replace />
  return <Navigate to="/manager" replace />
}

const RoleRoute = ({ roles, children }: { roles: UserRole[]; children: React.ReactNode }) => {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <RootRedirect />
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
        <Route path="/validate/:code" element={<ValidateCertificate />} />

        {/* Student Routes */}
        <Route
          element={
            <RoleRoute roles={['student']}>
              <Layout />
            </RoleRoute>
          }
        >
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/course/:id" element={<CoursePlayer />} />
          <Route path="/student/certificate/:id" element={<Certificate />} />
          <Route path="/student/partner" element={<PartnerDashboard />} />
        </Route>

        {/* Manager Routes */}
        <Route
          element={
            <RoleRoute roles={['manager']}>
              <Layout />
            </RoleRoute>
          }
        >
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/courses" element={<ManagerCourses />} />
          <Route path="/manager/courses/new" element={<CourseEditor />} />
          <Route path="/manager/courses/:id/edit" element={<CourseEditor />} />
          <Route path="/manager/enrollments" element={<ManagerEnrollments />} />
          <Route path="/manager/students/:id" element={<StudentDetails />} />
          <Route path="/manager/reports" element={<Reports />} />
          <Route path="/manager/questions" element={<QuestionBank />} />
          <Route path="/manager/partner" element={<PartnerDashboard />} />
          <Route path="/manager/settings/payments" element={<PaymentSettings />} />
          <Route path="/manager/settings/notifications" element={<NotificationSettings />} />
          <Route path="/manager/settings/integrations" element={<Integrations />} />
          <Route path="/manager/settings/commissions" element={<CommissionSettings />} />
          <Route path="/manager/settings/financial" element={<FinancialReports />} />
        </Route>

        {/* Instructor Routes */}
        <Route
          element={
            <RoleRoute roles={['instructor']}>
              <Layout />
            </RoleRoute>
          }
        >
          <Route path="/instructor" element={<ManagerDashboard />} />
          <Route path="/instructor/courses" element={<ManagerCourses />} />
          <Route path="/instructor/courses/:id/edit" element={<CourseEditor />} />
          <Route path="/instructor/enrollments" element={<ManagerEnrollments />} />
          <Route path="/instructor/students/:id" element={<StudentDetails />} />
          <Route path="/instructor/questions" element={<QuestionBank />} />
          <Route path="/instructor/grading" element={<GradeExams />} />
          <Route path="/instructor/partner" element={<PartnerDashboard />} />
          <Route path="/instructor/revenue" element={<Revenue />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
