import { useParams, Link } from 'react-router-dom'
import { useCommercialStore } from '@/stores/commercialStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function ProductDetails() {
  const { id } = useParams()
  const { products, speakers } = useCommercialStore()

  const product = products.find((p) => p.id === id)
  if (!product) return <div className="p-8 text-center">Produto não encontrado.</div>

  const speaker = speakers.find((s) => s.id === product.speakerId)

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/store">
          <ArrowLeft className="mr-2 size-4" /> Voltar para Loja
        </Link>
      </Button>

      <div className="grid md:grid-cols-12 gap-8 lg:gap-12">
        <div className="md:col-span-5">
          <img
            src={product.coverImage}
            alt={product.title}
            className="w-full rounded-2xl shadow-xl border border-border"
          />
        </div>

        <div className="md:col-span-7 space-y-6">
          <Badge className="uppercase tracking-wider font-semibold">
            {product.type === 'ebook' ? 'E-Book Digital' : 'Curso Online'}
          </Badge>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            {product.title}
          </h1>

          <div className="bg-muted/30 p-6 rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-widest">
                Investimento
              </p>
              {product.promotionalPrice ? (
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-extrabold text-[#176a7e]">
                    R$ {product.promotionalPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through pb-1 font-medium">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-4xl font-extrabold text-[#176a7e]">
                  R$ {product.price.toFixed(2)}
                </span>
              )}
            </div>
            <Button
              size="lg"
              className="h-14 px-8 bg-[#176a7e] hover:bg-[#115060] text-white text-lg font-semibold w-full sm:w-auto"
              onClick={() => toast.success('Redirecionando para o ambiente de pagamento seguro...')}
            >
              <ShoppingCart className="mr-2 size-5" /> Adquirir Agora
            </Button>
          </div>

          <div className="prose text-muted-foreground leading-relaxed text-base pt-2">
            <p>{product.description}</p>
          </div>

          {speaker && (
            <Card className="mt-8 border-border shadow-sm overflow-hidden">
              <div className="bg-muted/30 px-6 py-3 border-b text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Sobre o Autor / Palestrante
              </div>
              <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <img
                  src={
                    speaker.avatar || `https://img.usecurling.com/ppl/thumbnail?seed=${speaker.id}`
                  }
                  alt={speaker.name}
                  className="size-20 rounded-full object-cover border-2 border-muted shrink-0 shadow-sm"
                />
                <div>
                  <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-3 mb-2">
                    <h4 className="font-bold text-xl text-foreground">{speaker.name}</h4>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                      {speaker.type === 'internal'
                        ? 'Observatório Nacional de Seg. Viária'
                        : 'Especialista Externo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{speaker.bio}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
