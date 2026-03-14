import { PublicHeader } from '@/components/PublicHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col animate-in fade-in duration-1000">
      <PublicHeader />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
            Fale Conosco
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Nossa equipe de suporte acadêmico está pronta para ajudar você com dúvidas sobre
            matrículas, cursos ou parcerias institucionais.
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800 shadow-2xl">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">Nome Completo</label>
                <Input
                  className="bg-slate-950 border-slate-800 text-white h-12"
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">E-mail</label>
                <Input
                  className="bg-slate-950 border-slate-800 text-white h-12"
                  placeholder="Seu melhor e-mail"
                  type="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Mensagem</label>
              <textarea
                className="w-full min-h-[150px] p-4 rounded-md bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-blue-600 outline-none resize-y transition-shadow"
                placeholder="Como podemos ajudar?"
              />
            </div>
            <Button className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
              <Mail className="mr-2 size-5" /> Enviar Mensagem
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
