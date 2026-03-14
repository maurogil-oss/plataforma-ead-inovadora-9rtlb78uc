import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCommercialStore, Coupon } from '@/stores/commercialStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, ShoppingCart, BadgePercent } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function ProductDetails() {
  const { id } = useParams()
  const { products, speakers, coupons, incrementCouponUsage } = useCommercialStore()

  const [showCheckout, setShowCheckout] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)

  const product = products.find((p) => p.id === id)
  if (!product)
    return <div className="p-8 text-center text-brand font-bold">Produto não encontrado.</div>

  const speaker = speakers.find((s) => s.id === product.speakerId)

  const handleApplyCoupon = () => {
    if (!couponCode) return
    const validCoupon = coupons.find((c) => c.code === couponCode.toUpperCase() && c.isActive)

    if (!validCoupon) {
      return toast.error('Cupom inválido ou inativo.')
    }
    if (validCoupon.maxUses && validCoupon.currentUses >= validCoupon.maxUses) {
      return toast.error('O limite de uso deste cupom já foi atingido.')
    }
    if (validCoupon.validCourseIds?.length) {
      if (!product.courseId || !validCoupon.validCourseIds.includes(product.courseId)) {
        return toast.error('Este cupom não se aplica a este produto específico.')
      }
    }

    setAppliedCoupon(validCoupon)
    toast.success('Cupom aplicado com sucesso!')
  }

  const handleFinalize = () => {
    if (appliedCoupon) incrementCouponUsage(appliedCoupon.id)
    toast.success('Compra confirmada! O material já está disponível na sua conta.')
    setShowCheckout(false)
  }

  const basePrice = product.promotionalPrice || product.price
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? basePrice * (appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0
  const finalPrice = Math.max(0, basePrice - discountAmount)

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <Button variant="ghost" asChild className="mb-4 text-brand">
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
          <Badge className="uppercase tracking-wider font-semibold bg-brand text-brand-foreground hover:bg-brand/90">
            {product.type === 'ebook' ? 'E-Book Digital' : 'Curso Online'}
          </Badge>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand leading-tight">
            {product.title}
          </h1>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-brand mb-1 uppercase tracking-widest">
                Investimento
              </p>
              {product.promotionalPrice ? (
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-extrabold text-primary">
                    R$ {product.promotionalPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through pb-1 font-medium">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-4xl font-extrabold text-primary">
                  R$ {product.price.toFixed(2)}
                </span>
              )}
            </div>
            <Button
              size="lg"
              className="h-14 px-8 text-lg font-bold w-full sm:w-auto shadow-md"
              onClick={() => {
                setCouponCode('')
                setAppliedCoupon(null)
                setShowCheckout(true)
              }}
            >
              <ShoppingCart className="mr-2 size-5" /> Adquirir Agora
            </Button>
          </div>

          <div className="prose text-slate-600 leading-relaxed text-base pt-2">
            <p>{product.description}</p>
          </div>

          {speaker && (
            <Card className="mt-8 border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-brand/5 px-6 py-3 border-b border-slate-200 text-sm font-bold text-brand uppercase tracking-wider">
                Sobre o Autor / Especialista
              </div>
              <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <img
                  src={
                    speaker.avatar || `https://img.usecurling.com/ppl/thumbnail?seed=${speaker.id}`
                  }
                  alt={speaker.name}
                  className="size-20 rounded-full object-cover border-2 border-slate-200 shrink-0 shadow-sm"
                />
                <div>
                  <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-3 mb-2">
                    <h4 className="font-bold text-xl text-brand">{speaker.name}</h4>
                    <Badge
                      variant="secondary"
                      className="text-[10px] uppercase font-bold text-slate-700 bg-slate-200"
                    >
                      {speaker.type === 'internal'
                        ? 'Observatório Nacional de Seg. Viária'
                        : 'Especialista Externo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{speaker.bio}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-brand text-xl">Resumo do Pedido</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="flex gap-4 items-center">
              <img
                src={product.coverImage}
                className="w-16 h-16 object-cover rounded-md border"
                alt=""
              />
              <div className="flex-1">
                <h3 className="font-bold text-sm leading-tight text-brand line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-xs text-muted-foreground uppercase mt-1 font-semibold">
                  {product.type}
                </p>
              </div>
            </div>

            <div className="space-y-2 border-b pb-4">
              <label className="text-sm font-semibold flex items-center gap-2 text-brand">
                <BadgePercent className="size-4 text-primary" /> Código Promocional
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Insira o cupom"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="uppercase font-mono"
                  disabled={!!appliedCoupon}
                />
                {!appliedCoupon ? (
                  <Button variant="secondary" onClick={handleApplyCoupon}>
                    Aplicar
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setAppliedCoupon(null)
                      setCouponCode('')
                    }}
                  >
                    Remover
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border space-y-2">
              <div className="flex justify-between text-sm text-slate-500 font-medium">
                <span>Valor do Produto:</span>
                <span>R$ {basePrice.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-success font-bold">
                  <span>Desconto ({appliedCoupon.code}):</span>
                  <span>- R$ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center font-bold pt-2 border-t border-slate-200 mt-2">
                <span className="text-brand">Total da Compra:</span>
                <span className="text-2xl text-primary">R$ {finalPrice.toFixed(2)}</span>
              </div>
            </div>

            {finalPrice > 0 && (
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
                <p className="text-sm font-semibold text-brand">Pagamento Seguro</p>
                <Input placeholder="Número do Cartão" />
                <div className="flex gap-2">
                  <Input placeholder="MM/AA" />
                  <Input placeholder="CVC" />
                </div>
              </div>
            )}

            <Button className="w-full text-lg h-12 font-bold shadow-md" onClick={handleFinalize}>
              Confirmar Compra
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
