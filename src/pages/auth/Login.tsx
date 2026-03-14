import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShieldCheck, GraduationCap, Presentation } from 'lucide-react'
import { Logo } from '@/components/Logo'

export default function Login() {
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)

  if (user) {
    if (user.role === 'student') return <Navigate to="/student/dashboard" replace />
    if (user.role === 'instructor') return <Navigate to="/instructor/dashboard" replace />
    return <Navigate to="/manager/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="flex flex-col items-center gap-4 mb-8">
        <Logo className="h-24 w-auto transition-transform duration-500 hover:scale-105" />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-slate-200 bg-white">
        <CardHeader className="text-center pb-8 pt-8">
          <CardTitle className="text-2xl font-extrabold text-brand">Acesso à Plataforma</CardTitle>
          <CardDescription className="text-base mt-2 font-medium text-slate-500">
            Selecione seu perfil para acessar o ambiente de demonstração.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
          <Button
            size="lg"
            className="w-full h-14 text-lg justify-start px-6 font-bold shadow-md"
            onClick={() => login('student')}
          >
            <GraduationCap className="mr-4 size-6" />
            Acesso Aluno
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full h-14 text-lg justify-start px-6 border-brand text-brand hover:bg-brand hover:text-white font-bold"
            onClick={() => login('instructor')}
          >
            <Presentation className="mr-4 size-6" />
            Acesso Professor
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full h-14 text-lg justify-start px-6 border-brand text-brand hover:bg-brand hover:text-white font-bold"
            onClick={() => login('manager')}
          >
            <ShieldCheck className="mr-4 size-6" />
            Acesso Gestor
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
