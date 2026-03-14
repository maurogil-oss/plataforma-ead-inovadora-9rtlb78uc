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

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      navigate('/manager/dashboard')
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 py-12 dark:bg-slate-950 overflow-y-auto">
      <div className="w-full max-w-[540px] space-y-10">
        <div className="flex flex-col items-center justify-center space-y-8 mb-8">
          <div className="p-8 md:p-12 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 w-full flex items-center justify-center transition-all hover:shadow-md min-h-[280px]">
            <Logo imgClassName="h-56 sm:h-72 md:h-80 w-auto object-contain" linkTo="#" />
          </div>
          <div className="text-center space-y-3 px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand dark:text-white">
              Acesso à Plataforma
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
              Entre com suas credenciais para continuar
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-2xl shadow-brand/5 dark:shadow-none dark:border dark:border-slate-800 rounded-2xl overflow-hidden">
          <form onSubmit={handleLogin}>
            <CardHeader className="space-y-2 bg-white dark:bg-slate-900 pb-8 pt-8">
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <CardDescription className="text-base">
                Bem-vindo de volta! Sentimos sua falta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 bg-white dark:bg-slate-900">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-bold text-slate-700">
                  Endereço de E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@observatorio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-visible:ring-brand h-14 text-lg px-4 bg-slate-50 border-slate-200"
                  required
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-base font-bold text-slate-700">
                    Sua Senha
                  </Label>
                  <Link
                    to="#"
                    className="text-[15px] font-semibold text-brand hover:text-brand/80 dark:text-blue-400 hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus-visible:ring-brand h-14 text-lg px-4 bg-slate-50 border-slate-200"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-6 bg-white dark:bg-slate-900 pb-10 pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-brand hover:bg-brand/90 text-white h-14 text-lg font-bold shadow-lg shadow-brand/20"
                disabled={isLoading}
              >
                {isLoading ? 'Autenticando...' : 'Entrar na Plataforma'}
              </Button>
              <div className="text-center text-base text-slate-500 font-medium">
                Não possui conta ainda?{' '}
                <Link
                  to="/register"
                  className="font-bold text-orange-500 hover:text-orange-600 hover:underline ml-1"
                >
                  Cadastre-se agora
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
