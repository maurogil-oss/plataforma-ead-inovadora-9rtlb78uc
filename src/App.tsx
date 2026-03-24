import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { LiveNotifier } from '@/components/LiveNotifier'
import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import NotFound from '@/pages/NotFound'
import Login from '@/pages/auth/Login'
import About from '@/pages/public/About'
import ValidateCertificate from '@/pages/public/ValidateCertificate'
import CoursesPage from '@/pages/public/Courses'
import PlansPage from '@/pages/public/Plans'
import ContactPage from '@/pages/public/Contact'

// Shared Forum Routes
import ForumIndex from '@/pages/shared/ForumIndex'
import ForumTopicList from '@/pages/shared/ForumTopicList'
import ForumTopicView from '@/pages/shared/ForumTopicView'

// Shared Media Library
import MediaLibrary from '@/pages/shared/MediaLibrary'

// Student
import StudentDashboard from '@/pages/student/Dashboard'
import CoursePlayer from '@/pages/student/CoursePlayer'
import Certificate from '@/pages/student/Certificate'
import MyEnrollments from '@/pages/student/MyEnrollments'

// Instructor & Manager
import GradeExams from '@/pages/instructor/GradeExams'
import Revenue from '@/pages/instructor/Revenue'
import LiveClasses from '@/pages/instructor/LiveClasses'
import LessonGenerator from '@/pages/instructor/LessonGenerator'
import EngagementDashboard from '@/pages/instructor/EngagementDashboard'

import ManagerDashboard from '@/pages/manager/Dashboard'
import Courses from '@/pages/manager/Courses'
import CourseEditor from '@/pages/manager/CourseEditor'
import Enrollments from '@/pages/manager/Enrollments'
import Reports from '@/pages/manager/Reports'
import FinancialReports from '@/pages/manager/FinancialReports'
import NotificationSettings from '@/pages/manager/NotificationSettings'
import Integrations from '@/pages/manager/Integrations'
import CommissionSettings from '@/pages/manager/CommissionSettings'
import PaymentSettings from '@/pages/manager/PaymentSettings'
import StudentDetails from '@/pages/manager/StudentDetails'
import AppearanceSettings from '@/pages/manager/AppearanceSettings'
import KPIDashboard from '@/pages/manager/KPIDashboard'

// Shared Commercial
import CommercialDashboard from '@/pages/manager/CommercialDashboard'
import Storefront from '@/pages/shared/Storefront'
import ProductDetails from '@/pages/shared/ProductDetails'
import PartnerDashboard from '@/pages/shared/PartnerDashboard'
import QuestionBank from '@/pages/shared/QuestionBank'

// Stores
import { useAuthStore } from '@/stores/authStore'

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles?: string[]
}) {
  const { user, isAuthenticated } = useAuthStore((s) => ({
    user: s.user,
    isAuthenticated: !!s.user,
  }))

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'manager' || user.role === 'admin')
      return <Navigate to="/manager/dashboard" replace />
    if (user.role === 'instructor') return <Navigate to="/instructor/dashboard" replace />
    return <Navigate to="/student/dashboard" replace />
  }

  return <>{children}</>
}

export default function App() {
  useEffect(() => {
    document.title = 'Observatório Academy'

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    applyTheme(mediaQuery)

    const listener = (e: MediaQueryListEvent) => applyTheme(e)
    mediaQuery.addEventListener('change', listener)

    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) {
      localStorage.setItem('affiliate_ref', ref)
    }

    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  return (
    <Router>
      <Toaster />
      <LiveNotifier />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/cursos" element={<CoursesPage />} />
        <Route path="/planos" element={<PlansPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/validate-certificate/:id" element={<ValidateCertificate />} />

        {/* Public / Semi-Public Forum Routes */}
        <Route path="/forum" element={<ForumIndex />} />
        <Route path="/forum/:forumId" element={<ForumTopicList />} />
        <Route path="/forum/topic/:topicId" element={<ForumTopicView />} />

        {/* App Layout for authenticated routes */}
        <Route element={<Layout />}>
          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <Storefront />
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses"
            element={
              <ProtectedRoute>
                <MyEnrollments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/course/:id"
            element={
              <ProtectedRoute>
                <CoursePlayer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/certificate/:id"
            element={
              <ProtectedRoute>
                <Certificate />
              </ProtectedRoute>
            }
          />

          {/* Instructor Routes */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'manager', 'admin']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/grade-exams"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'manager', 'admin']}>
                <GradeExams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/revenue"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'manager', 'admin']}>
                <Revenue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/questions"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'manager', 'admin']}>
                <QuestionBank />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/live-classes"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'manager', 'admin']}>
                <LiveClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/lesson-generator"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'manager', 'admin']}>
                <LessonGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/engagement"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'manager', 'admin']}>
                <EngagementDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/commercial"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'manager', 'admin']}>
                <CommercialDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'manager', 'admin']}>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/media"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'manager', 'admin']}>
                <MediaLibrary />
              </ProtectedRoute>
            }
          />

          {/* Manager/Admin Routes */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/kpis"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <KPIDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/courses"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/course/:id"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <CourseEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/courses/new"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <CourseEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/media"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <MediaLibrary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/enrollments"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <Enrollments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/students/:id"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <StudentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/reports"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/finance"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <FinancialReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/notifications"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <NotificationSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/integrations"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <Integrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/commissions"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <CommissionSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/payments"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <PaymentSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/live-classes"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <LiveClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/lesson-generator"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <LessonGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/commercial"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <CommercialDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/appearance"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <AppearanceSettings />
              </ProtectedRoute>
            }
          />

          {/* Shared/Partner Routes */}
          <Route
            path="/partner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['partner', 'manager', 'admin']}>
                <PartnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/partner"
            element={
              <ProtectedRoute allowedRoles={['instructor', 'manager', 'admin']}>
                <PartnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/partner"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'manager', 'admin']}>
                <PartnerDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
