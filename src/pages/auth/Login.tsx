import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LogIn, BookOpen, UserCircle, Settings } from 'lucide-react'
import { Logo } from '@/components/Logo'

export default function Login() {
  const [role, setRole] = useState<'student' | 'instructor' | 'manager'>('student')
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(role)
    if (role === 'manager') navigate('/manager/dashboard')
    else if (role === 'instructor') navigate('/instructor/dashboard')
    else navigate('/student/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-slate-950 animate-in fade-in duration-1000">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:w-[45%] max-w-2xl mx-auto w-full pt-8 pb-12 sm:pb-8">
        <div className="w-full max-w-sm mx-auto space-y-8">
          <Link
            to="/"
            className="flex items-center justify-center sm:justify-start hover:opacity-80 transition-opacity"
          >
            <Logo imgClassName="h-12 w-auto" />
          </Link>

          <Card className="border-slate-800 bg-slate-900 shadow-2xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-extrabold text-white text-center sm:text-left">
                Acesso à Plataforma
              </CardTitle>
              <CardDescription className="text-slate-400 font-medium text-center sm:text-left">
                Selecione seu perfil para acessar o ambiente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <Button
                    type="button"
                    variant={role === 'student' ? 'default' : 'outline'}
                    className={`h-auto py-3 px-2 flex flex-col gap-2 border-slate-700 ${role === 'student' ? 'bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-md scale-[1.02]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                    onClick={() => setRole('student')}
                  >
                    <BookOpen className="size-5" />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      Aluno
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant={role === 'instructor' ? 'default' : 'outline'}
                    className={`h-auto py-3 px-2 flex flex-col gap-2 border-slate-700 ${role === 'instructor' ? 'bg-amber-600 hover:bg-amber-700 text-white border-transparent shadow-md scale-[1.02]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                    onClick={() => setRole('instructor')}
                  >
                    <UserCircle className="size-5" />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      Docente
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant={role === 'manager' ? 'default' : 'outline'}
                    className={`h-auto py-3 px-2 flex flex-col gap-2 border-slate-700 ${role === 'manager' ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-md scale-[1.02]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                    onClick={() => setRole('manager')}
                  >
                    <Settings className="size-5" />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      Gestor
                    </span>
                  </Button>
                </div>
                <div className="space-y-4">
                  <Input
                    placeholder="E-mail"
                    type="email"
                    required
                    defaultValue={`${role}@empresa.com`}
                    className="h-12 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 font-medium"
                  />
                  <Input
                    placeholder="Senha"
                    type="password"
                    required
                    defaultValue="123456"
                    className="h-12 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 font-medium"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-bold shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <LogIn className="mr-2 size-5" /> Entrar no Sistema
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1 bg-slate-900 border-l border-slate-800 overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-overlay transition-transform duration-1000 hover:scale-105"
          src="https://img.usecurling.com/p/1200/1000?q=smart%20city&color=blue"
          alt="Smart City"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
            Educação que transforma
            <br />a mobilidade urbana.
          </h2>
          <p className="text-lg text-slate-300 font-medium max-w-lg drop-shadow-md">
            Capacite-se com as melhores práticas de segurança viária e cidades inteligentes do
            Brasil.
          </p>
        </div>
      </div>
    </div>
  )
}
