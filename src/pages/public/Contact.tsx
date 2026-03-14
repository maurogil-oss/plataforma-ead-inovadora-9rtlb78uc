import { PublicHeader } from '@/components/PublicHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Instagram, Linkedin, Youtube, Send } from 'lucide-react'

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <PublicHeader />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
            Fale Conosco
          </h1>
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
            Tem dúvidas sobre a plataforma ou nossos cursos? Preencha o formulário abaixo e nossa
            equipe entrará em contato o mais rápido possível.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-slate-800 shadow-2xl bg-slate-900 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-16 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              <CardContent className="p-8 relative z-10 space-y-8">
                <div>
                  <h3 className="text-2xl font-extrabold mb-2 text-white">
                    Informações de Contato
                  </h3>
                  <p className="text-slate-400 text-sm font-medium">
                    Estamos disponíveis de Segunda a Sexta, das 09h às 18h.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-800 text-primary p-3 rounded-xl shadow-inner">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 font-semibold">E-mail</p>
                      <p className="font-bold tracking-wide text-slate-200">
                        contato@observatorio.academy
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-800 text-primary p-3 rounded-xl shadow-inner">
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 font-semibold">Telefone / WhatsApp</p>
                      <p className="font-bold tracking-wide text-slate-200">+55 11 99999-9999</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-800 text-primary p-3 rounded-xl shadow-inner">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 font-semibold">Endereço</p>
                      <p className="font-bold leading-snug text-slate-200">
                        Av. Paulista, 1234 - Bela Vista
                        <br />
                        São Paulo - SP, 01310-100
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800">
                  <p className="text-sm text-slate-400 mb-4 font-bold uppercase tracking-wider">
                    Redes sociais
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="bg-slate-800 hover:bg-primary text-slate-300 hover:text-white p-3 rounded-xl transition-colors shadow-sm"
                    >
                      <Instagram className="size-5" />
                    </a>
                    <a
                      href="#"
                      className="bg-slate-800 hover:bg-primary text-slate-300 hover:text-white p-3 rounded-xl transition-colors shadow-sm"
                    >
                      <Linkedin className="size-5" />
                    </a>
                    <a
                      href="#"
                      className="bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white p-3 rounded-xl transition-colors shadow-sm"
                    >
                      <Youtube className="size-5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="border-slate-800 shadow-2xl bg-slate-900">
              <CardContent className="p-8">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300 font-bold">
                        Nome Completo
                      </Label>
                      <Input
                        id="name"
                        placeholder="Ex: João da Silva"
                        className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-primary h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300 font-bold">
                        E-mail Corporativo ou Pessoal
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="joao@exemplo.com"
                        className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-primary h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-300 font-bold">
                      Assunto
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Como podemos ajudar?"
                      className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-primary h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-300 font-bold">
                      Mensagem
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Descreva detalhadamente sua dúvida ou solicitação..."
                      className="min-h-[150px] bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600 resize-y focus-visible:ring-primary p-4"
                    />
                  </div>
                  <Button className="w-full sm:w-auto px-8 h-12 font-bold text-base shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
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
