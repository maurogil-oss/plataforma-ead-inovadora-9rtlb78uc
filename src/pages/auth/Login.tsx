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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-6 mb-8">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <Logo className="h-16 w-auto" linkTo="#" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Bem-vindo à Plataforma
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Acesse o ambiente educacional e painel de gestão
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-none dark:border dark:border-slate-800">
          <form onSubmit={handleLogin}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Login</CardTitle>
              <CardDescription>Insira suas credenciais para continuar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@observatorio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-visible:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    to="#"
                    className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus-visible:ring-blue-500"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar na Plataforma'}
              </Button>
              <div className="text-center text-sm text-slate-500">
                Não possui conta?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-orange-500 hover:text-orange-600 hover:underline"
                >
                  Cadastre-se
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
