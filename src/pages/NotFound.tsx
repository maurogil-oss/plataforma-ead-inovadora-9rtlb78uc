import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50 px-4 text-center animate-in fade-in duration-1000">
      <AlertCircle className="size-24 text-blue-600 mb-8 animate-bounce" />
      <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 text-white">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-300 mb-6">Página não encontrada</h2>
      <p className="text-slate-400 font-medium max-w-md mb-10 text-lg">
        O conteúdo que você está tentando acessar foi movido ou não existe mais.
      </p>
      <Button
        asChild
        size="lg"
        className="h-12 px-8 font-bold shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Link to="/">
          <Home className="mr-2 size-5" /> Voltar ao Início
        </Link>
      </Button>
    </div>
  )
}
