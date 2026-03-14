import { useParams, Link } from 'react-router-dom'
import { PublicHeader } from '@/components/PublicHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ShieldCheck, Home } from 'lucide-react'

export default function ValidateCertificate() {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col animate-in fade-in duration-1000">
      <PublicHeader />
      <main className="flex-1 container mx-auto px-4 py-20 flex items-center justify-center">
        <Card className="w-full max-w-lg bg-slate-900 border-slate-800 shadow-2xl text-center">
          <CardContent className="p-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 border border-emerald-500/30">
              <ShieldCheck className="size-12 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
              Certificado Válido
            </h1>
            <p className="text-slate-400 font-medium mb-8">
              O código de validação <strong className="text-white uppercase font-mono">{id}</strong>{' '}
              é autêntico e reconhecido pela plataforma.
            </p>

            <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-6 mb-8 text-left space-y-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Titular
                  </p>
                  <p className="text-slate-200 font-bold text-lg">João Aluno</p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t border-slate-800 pt-5">
                <CheckCircle2 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Programa Concluído
                  </p>
                  <p className="text-slate-200 font-bold text-lg">Gestão de Mobilidade Urbana</p>
                </div>
              </div>
            </div>

            <Button
              asChild
              className="w-full h-12 font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link to="/">
                <Home className="mr-2 size-5" /> Voltar ao Início
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
