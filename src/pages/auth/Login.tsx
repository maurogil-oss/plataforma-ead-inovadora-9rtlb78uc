import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-4 mb-8">
        <img
          src={logoUrl}
          alt="Observatório Academy"
          className="h-24 w-auto object-contain mix-blend-screen invert hue-rotate-180 opacity-95 transition-transform duration-500 hover:scale-105 drop-shadow-md"
        />
      </div>

      <Card className="w-full max-w-md shadow-xl border-border bg-card">
        <CardHeader className="text-center pb-8 pt-8">
          <CardTitle className="text-2xl font-bold text-foreground">Acesso à Plataforma</CardTitle>
          <CardDescription className="text-base mt-2">
            Selecione seu perfil para acessar o ambiente de demonstração.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
          <Button
            size="lg"
            className="w-full h-14 text-lg justify-start px-6 bg-[#176a7e] hover:bg-[#115060] text-white"
            onClick={() => login('student')}
          >
            <GraduationCap className="mr-4 size-5" />
            Acesso Aluno
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full h-14 text-lg justify-start px-6 border border-border bg-background hover:bg-muted text-foreground"
            onClick={() => login('instructor')}
          >
            <Presentation className="mr-4 size-5 text-muted-foreground" />
            Acesso Professor
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full h-14 text-lg justify-start px-6 border border-border bg-background hover:bg-muted text-foreground"
            onClick={() => login('manager')}
          >
            <ShieldCheck className="mr-4 size-5 text-muted-foreground" />
            Acesso Gestor
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
