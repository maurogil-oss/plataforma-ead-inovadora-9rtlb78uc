import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicHeader } from '@/components/PublicHeader'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    name: 'Gratuito',
    desc: 'Ideal para conhecer a plataforma.',
    priceMo: 0,
    priceYr: 0,
    features: [
      'Acesso a 2 cursos gratuitos',
      'Certificado digital simples',
      'Suporte da comunidade',
    ],
    cta: 'Criar Conta Grátis',
    popular: false,
  },
  {
    name: 'Profissional',
    desc: 'Para quem busca acelerar a carreira.',
    priceMo: 49,
    priceYr: 39,
    features: [
      'Acesso ilimitado ao catálogo',
      'Certificados com validação QR Code',
      'Suporte prioritário',
      'Materiais extras em PDF e Planilhas',
    ],
    cta: 'Assinar Profissional',
    popular: true,
  },
  {
    name: 'Premium',
    desc: 'A experiência educacional definitiva.',
    priceMo: 99,
    priceYr: 79,
    features: [
      'Tudo do plano Profissional',
      'Mentorias ao vivo semanais',
      'Correção de provas humanizada',
      'Acesso a eventos presenciais exclusivos',
    ],
    cta: 'Assinar Premium',
    popular: false,
  },
]

export default function Plans() {
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-brand tracking-tight">
            Planos e Assinaturas
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Escolha o plano ideal para o seu momento profissional e tenha acesso à melhor plataforma
            de ensino.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-16">
          <Label
            className={cn(
              'text-sm font-extrabold cursor-pointer',
              !isAnnual ? 'text-brand' : 'text-slate-400',
            )}
            onClick={() => setIsAnnual(false)}
          >
            Mensal
          </Label>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <Label
            className={cn(
              'text-sm font-extrabold cursor-pointer flex items-center',
              isAnnual ? 'text-brand' : 'text-slate-400',
            )}
            onClick={() => setIsAnnual(true)}
          >
            Anual{' '}
            <span className="ml-2 bg-success/20 text-success-foreground px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
              Economize 20%
            </span>
          </Label>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => {
            const price = isAnnual ? plan.priceYr : plan.priceMo
            return (
              <Card
                key={plan.name}
                className={cn(
                  'flex flex-col relative transition-all duration-300 bg-white border-slate-200',
                  plan.popular
                    ? 'border-primary shadow-2xl shadow-primary/10 scale-105 z-10'
                    : 'hover:shadow-lg',
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                    Mais Popular
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl font-extrabold text-brand">{plan.name}</CardTitle>
                  <p className="text-sm text-slate-500 font-medium mt-2">{plan.desc}</p>
                  <div className="mt-6 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold text-brand">R$ {price}</span>
                    <span className="text-slate-500 font-bold">/mês</span>
                  </div>
                  {isAnnual && price > 0 && (
                    <p className="text-xs text-slate-400 font-bold mt-2">
                      Faturado R$ {price * 12} anualmente
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="bg-primary/20 rounded-full p-1 shrink-0 mt-0.5">
                          <Check className="size-3.5 text-primary" strokeWidth={4} />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pb-8">
                  <Button
                    className={cn(
                      'w-full h-12 text-base font-bold shadow-sm',
                      plan.popular
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-white text-brand border-2 border-brand hover:bg-brand hover:text-white',
                    )}
                    asChild
                  >
                    <Link to="/login">{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
