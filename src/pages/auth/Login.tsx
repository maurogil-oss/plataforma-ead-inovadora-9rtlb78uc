import { Navigate } from 'react-router-dom'
import { useAuthStore, UserRole } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BookOpen, ShieldCheck, GraduationCap, Presentation } from 'lucide-react'

export default function Login() {
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)

  if (user) {
    if (user.role === 'student') return <Navigate to="/student" replace />
    if (user.role === 'instructor') return <Navigate to="/instructor" replace />
    return <Navigate to="/manager" replace />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="flex items-center gap-3 mb-8 text-primary">
        <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-lg">
          <BookOpen className="size-8" />
        </div>
        <span className="font-bold text-3xl tracking-tight text-foreground">Olimpo EAD</span>
      </div>

      <Card className="w-full max-w-md shadow-elevation border-border/50 bg-card">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl">Acesso à Plataforma</CardTitle>
          <CardDescription>
            Selecione seu perfil para acessar o ambiente de demonstração.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            size="lg"
            className="w-full h-14 text-lg justify-start px-6"
            onClick={() => login('student')}
          >
            <GraduationCap className="mr-4 size-5 opacity-70" />
            Acesso Aluno
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full h-14 text-lg justify-start px-6 border bg-muted/50 hover:bg-muted"
            onClick={() => login('instructor')}
          >
            <Presentation className="mr-4 size-5 opacity-70" />
            Acesso Professor
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full h-14 text-lg justify-start px-6 border bg-muted/50 hover:bg-muted"
            onClick={() => login('manager')}
          >
            <ShieldCheck className="mr-4 size-5 opacity-70" />
            Acesso Gestor
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
