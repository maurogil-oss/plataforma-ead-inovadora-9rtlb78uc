import { Navigate } from 'react-router-dom'
import { useAuthStore, UserRole } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShieldCheck, GraduationCap, Presentation } from 'lucide-react'
import logoUrl from '@/assets/logo-academy-2-82c76.png'

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
        <img
          src={logoUrl}
          alt="Observatório Academy"
          className="h-16 w-auto bg-transparent object-contain drop-shadow-md"
        />
      </div>

      <Card className="w-full max-w-md shadow-xl border-slate-200 bg-white">
        <CardHeader className="text-center pb-8 pt-8">
          <CardTitle className="text-2xl font-bold text-slate-900">Acesso à Plataforma</CardTitle>
          <CardDescription className="text-base mt-2">
            Selecione seu perfil para acessar o ambiente de demonstração.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
          <Button
            size="lg"
            className="w-full h-14 text-lg justify-start px-6 bg-[#176a7e] hover:bg-[#115060]"
            onClick={() => login('student')}
          >
            <GraduationCap className="mr-4 size-5" />
            Acesso Aluno
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full h-14 text-lg justify-start px-6 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
            onClick={() => login('instructor')}
          >
            <Presentation className="mr-4 size-5 text-slate-500" />
            Acesso Professor
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full h-14 text-lg justify-start px-6 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
            onClick={() => login('manager')}
          >
            <ShieldCheck className="mr-4 size-5 text-slate-500" />
            Acesso Gestor
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
