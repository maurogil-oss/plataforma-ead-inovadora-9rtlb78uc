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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-brand tracking-tight">
            Fale Conosco
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Tem dúvidas sobre a plataforma ou nossos cursos? Preencha o formulário abaixo e nossa
            equipe entrará em contato o mais rápido possível.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-xl bg-brand text-brand-foreground overflow-hidden relative">
              <div className="absolute top-0 right-0 p-16 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
              <CardContent className="p-8 relative z-10 space-y-8">
                <div>
                  <h3 className="text-2xl font-extrabold mb-2">Informações de Contato</h3>
                  <p className="text-brand-foreground/70 text-sm font-medium">
                    Estamos disponíveis de Segunda a Sexta, das 09h às 18h.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/20 text-primary p-3 rounded-full">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-foreground/70 font-semibold">E-mail</p>
                      <p className="font-bold tracking-wide">contato@observatorio.academy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/20 text-primary p-3 rounded-full">
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-foreground/70 font-semibold">
                        Telefone / WhatsApp
                      </p>
                      <p className="font-bold tracking-wide">+55 11 99999-9999</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/20 text-primary p-3 rounded-full">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm text-brand-foreground/70 font-semibold">Endereço</p>
                      <p className="font-bold leading-snug">
                        Av. Paulista, 1234 - Bela Vista
                        <br />
                        São Paulo - SP, 01310-100
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-brand-foreground/10">
                  <p className="text-sm text-brand-foreground/70 mb-4 font-bold uppercase tracking-wider">
                    Redes sociais
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-primary hover:text-primary-foreground p-3 rounded-full transition-colors"
                    >
                      <Instagram className="size-5" />
                    </a>
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-primary hover:text-primary-foreground p-3 rounded-full transition-colors"
                    >
                      <Linkedin className="size-5" />
                    </a>
                    <a
                      href="#"
                      className="bg-white/10 hover:bg-primary hover:text-primary-foreground p-3 rounded-full transition-colors"
                    >
                      <Youtube className="size-5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="border-slate-200 shadow-lg bg-white">
              <CardContent className="p-8">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-brand font-bold">
                        Nome Completo
                      </Label>
                      <Input
                        id="name"
                        placeholder="Ex: João da Silva"
                        className="bg-slate-50 border-slate-200 focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-brand font-bold">
                        E-mail Corporativo ou Pessoal
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="joao@exemplo.com"
                        className="bg-slate-50 border-slate-200 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-brand font-bold">
                      Assunto
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Como podemos ajudar?"
                      className="bg-slate-50 border-slate-200 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-brand font-bold">
                      Mensagem
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Descreva detalhadamente sua dúvida ou solicitação..."
                      className="min-h-[150px] bg-slate-50 border-slate-200 resize-y focus-visible:ring-primary"
                    />
                  </div>
                  <Button className="w-full sm:w-auto px-8 h-12 font-bold text-base shadow-md">
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
