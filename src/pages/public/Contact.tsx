import { PublicHeader } from '@/components/PublicHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Instagram, Linkedin, Youtube, Send } from 'lucide-react'

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 tracking-tight">
            Fale Conosco
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tem dúvidas sobre a plataforma ou nossos cursos? Preencha o formulário abaixo e nossa
            equipe entrará em contato o mais rápido possível.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-lg bg-[#176a7e] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <CardContent className="p-8 relative z-10 space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Informações de Contato</h3>
                  <p className="text-cyan-100 text-sm">
                    Estamos disponíveis de Segunda a Sexta, das 09h às 18h.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-100">E-mail</p>
                      <p className="font-semibold">contato@observatorio.academy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-100">Telefone / WhatsApp</p>
                      <p className="font-semibold">+55 11 99999-9999</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-100">Endereço</p>
                      <p className="font-semibold leading-snug">
                        Av. Paulista, 1234 - Bela Vista
                        <br />
                        São Paulo - SP, 01310-100
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/20">
                  <p className="text-sm text-cyan-100 mb-4 font-medium">
                    Siga nossas redes sociais:
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors"
                    >
                      <Instagram className="size-5" />
                    </a>
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors"
                    >
                      <Linkedin className="size-5" />
                    </a>
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors"
                    >
                      <Youtube className="size-5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-8">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700">
                        Nome Completo
                      </Label>
                      <Input id="name" placeholder="Ex: João da Silva" className="bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">
                        E-mail Corporativo ou Pessoal
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="joao@exemplo.com"
                        className="bg-slate-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-700">
                      Assunto
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Como podemos ajudar?"
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-700">
                      Mensagem
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Descreva detalhadamente sua dúvida ou solicitação..."
                      className="min-h-[150px] bg-slate-50 resize-y"
                    />
                  </div>
                  <Button className="w-full sm:w-auto px-8 h-12 bg-[#176a7e] hover:bg-[#115060] text-base font-semibold">
                    <Send className="mr-2 size-4" /> Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
