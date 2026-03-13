import { useState } from 'react'
import { useLmsStore } from '@/stores/lmsStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Save, Link2 } from 'lucide-react'

export default function PaymentSettings() {
  const { paymentSettings, updatePaymentSettings } = useLmsStore()
  const [settings, setSettings] = useState(paymentSettings)

  const handleSave = () => {
    updatePaymentSettings(settings)
    toast.success('Configurações de pagamento atualizadas e integradas com sucesso.')
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integração de Pagamentos</h1>
        <p className="text-muted-foreground mt-1">
          Conecte seu gateway para automatizar matrículas após o checkout.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="size-5 text-primary" /> Credenciais da API
          </CardTitle>
          <CardDescription>
            Insira os dados do seu provedor (Stripe, Pagar.me, Mercado Pago, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Provedor de Pagamento</label>
            <Input
              value={settings.provider}
              onChange={(e) => setSettings({ ...settings, provider: e.target.value })}
              placeholder="Ex: Stripe"
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Chave de API Pública</label>
            <Input placeholder="pk_live_..." className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Chave de API Secreta (Secret Key)</label>
            <Input
              type="password"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              placeholder="sk_live_..."
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2 pt-2">
            <label className="text-sm font-semibold">
              Webhook Endpoint (Recebimento de Eventos)
            </label>
            <Input
              value="https://api.plataforma.com/webhooks/payments"
              readOnly
              className="bg-muted/20 text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Configure esta URL no seu provedor para receber notificações de pagamentos aprovados.
            </p>
          </div>
          <Button onClick={handleSave} className="mt-4 w-full sm:w-auto">
            <Save className="mr-2 size-4" /> Salvar Integração
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
