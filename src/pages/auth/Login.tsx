import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Logo } from '@/components/Logo'
import { useAuthStore } from '@/stores/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      let role: 'student' | 'instructor' | 'manager' = 'student'
      if (email.includes('admin') || email.includes('manager')) role = 'manager'
      if (email.includes('prof') || email.includes('instructor')) role = 'instructor'

      login(role)

      if (role === 'student') navigate('/student/dashboard')
      else if (role === 'instructor') navigate('/instructor/dashboard')
      else navigate('/manager/dashboard')

      setIsLoading(false)
    }, 800)
  }

  return (
    // Single-Screen Constraint: Exactly 100vh, hidden overflow to prevent scrolling
    <div className="flex h-[100dvh] w-full items-center justify-center bg-slate-950 p-4 text-slate-50 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1200/800?q=cinema&color=blue&dpr=1')] opacity-[0.15] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />

      <div className="w-full max-w-[420px] flex flex-col justify-center space-y-6 relative z-10 h-full max-h-screen py-2">
        <div className="flex flex-col items-center justify-center space-y-4 shrink-0">
          <Link to="/">
            <Logo imgClassName="h-16 sm:h-20 w-auto object-contain" />
          </Link>
          <div className="text-center space-y-1.5 px-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md">
              Acesso à Plataforma
            </h2>
            <p className="text-sm text-slate-400 font-medium">Entre para continuar sua jornada</p>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden shrink-0">
          <form onSubmit={handleLogin}>
            <CardHeader className="space-y-1 pb-4 pt-6 text-center border-b border-slate-800/50">
              <CardTitle className="text-xl font-bold text-white">Entrar</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Dica: Digite "admin" para Gestor ou "prof" para Instrutor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-bold text-slate-300">
                  Endereço de E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="aluno@observatorio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-visible:ring-primary h-12 text-base px-4 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
                  required
                />
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-bold text-slate-300">
                    Sua Senha
                  </Label>
                  <Link
                    to="#"
                    className="text-xs font-bold text-primary hover:text-primary/80 hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus-visible:ring-primary h-12 text-base px-4 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pb-6 pt-2 shrink-0">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-bold shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Autenticando...' : 'Acessar Catálogo'}
              </Button>
              <div className="text-center text-xs text-slate-400 font-medium">
                Novo por aqui?{' '}
                <Link
                  to="/"
                  className="font-bold text-white hover:text-primary transition-colors ml-1"
                >
                  Assine agora.
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
