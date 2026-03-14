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
      // Logic to pick a mock role based on email to demonstrate different dashboards easily
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
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 py-12 text-slate-50 overflow-y-auto relative">
      <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1200/800?q=cinema&color=blue&dpr=1')] opacity-[0.15] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />

      <div className="w-full max-w-[480px] space-y-8 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-6 mb-4">
          <Link to="/">
            <Logo imgClassName="h-32 sm:h-40 w-auto object-contain drop-shadow-2xl transition-transform hover:scale-105" />
          </Link>
          <div className="text-center space-y-2 px-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
              Acesso à Plataforma
            </h2>
            <p className="text-base text-slate-400 font-medium">Entre para continuar sua jornada</p>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <form onSubmit={handleLogin}>
            <CardHeader className="space-y-1 pb-6 pt-8 text-center border-b border-slate-800/50">
              <CardTitle className="text-2xl font-bold text-white">Entrar</CardTitle>
              <CardDescription className="text-slate-400">
                Dica: Digite "admin" para Gestor ou "prof" para Instrutor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-bold text-slate-300">
                  Endereço de E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="aluno@observatorio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-visible:ring-primary h-14 text-base px-4 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
                  required
                />
              </div>
              <div className="space-y-3">
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
                  className="focus-visible:ring-primary h-14 text-base px-4 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-6 pb-10 pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg font-bold shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Autenticando...' : 'Acessar Catálogo'}
              </Button>
              <div className="text-center text-sm text-slate-400 font-medium">
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
