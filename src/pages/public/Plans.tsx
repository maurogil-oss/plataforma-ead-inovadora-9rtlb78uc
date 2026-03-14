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
    name: 'Básico',
    desc: 'Ideal para conhecer a plataforma.',
    priceMo: 29,
    priceYr: 19,
    features: [
      'Acesso a 2 cursos simultâneos',
      'Qualidade SD (480p)',
      'Certificado digital simples',
      'Assista no Computador ou Celular',
    ],
    cta: 'Assinar Básico',
    popular: false,
  },
  {
    name: 'Padrão',
    desc: 'Para quem busca acelerar a carreira.',
    priceMo: 49,
    priceYr: 39,
    features: [
      'Acesso ilimitado ao catálogo',
      'Qualidade Full HD (1080p)',
      'Certificados com validação QR Code',
      'Materiais extras em PDF e Planilhas',
    ],
    cta: 'Assinar Padrão',
    popular: true,
  },
  {
    name: 'Premium',
    desc: 'A experiência educacional definitiva.',
    priceMo: 89,
    priceYr: 69,
    features: [
      'Tudo do plano Padrão',
      'Qualidade 4K Ultra HD',
      'Mentorias ao vivo semanais',
      'Correção de provas humanizada',
    ],
    cta: 'Assinar Premium',
    popular: false,
  },
]

export default function Plans() {
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <PublicHeader />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
            Escolha seu Plano
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Assista onde quiser. Cancele quando quiser.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-16">
          <Label
            className={cn(
              'text-sm font-extrabold cursor-pointer',
              !isAnnual ? 'text-white' : 'text-slate-500',
            )}
            onClick={() => setIsAnnual(false)}
          >
            Mensal
          </Label>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="data-[state=checked]:bg-primary"
          />
          <Label
            className={cn(
              'text-sm font-extrabold cursor-pointer flex items-center',
              isAnnual ? 'text-white' : 'text-slate-500',
            )}
            onClick={() => setIsAnnual(true)}
          >
            Anual{' '}
            <span className="ml-2 bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-sm">
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
                  'flex flex-col relative transition-all duration-300 bg-slate-900 border-slate-800',
                  plan.popular
                    ? 'border-blue-600 shadow-2xl shadow-blue-600/20 scale-105 z-10'
                    : 'hover:shadow-lg',
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Mais Assinado
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8 border-b border-slate-800">
                  <CardTitle className="text-2xl font-extrabold text-white">{plan.name}</CardTitle>
                  <p className="text-sm text-slate-400 font-medium mt-2">{plan.desc}</p>
                  <div className="mt-6 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-black text-white">R$ {price}</span>
                    <span className="text-slate-400 font-bold">/mês</span>
                  </div>
                  {isAnnual && price > 0 && (
                    <p className="text-xs text-slate-500 font-bold mt-2">
                      Faturado R$ {price * 12} anualmente
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-1 pt-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="bg-primary/20 rounded-full p-1 shrink-0 mt-0.5">
                          <Check className="size-3.5 text-primary" strokeWidth={4} />
                        </div>
                        <span className="text-sm font-medium text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pb-8">
                  <Button
                    className={cn(
                      'w-full h-14 text-base font-bold shadow-md',
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-slate-800 text-white hover:bg-slate-700',
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
