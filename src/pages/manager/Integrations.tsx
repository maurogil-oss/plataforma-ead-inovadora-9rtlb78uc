import { useState } from 'react'
import { useLmsStore, WebhookConfig } from '@/stores/lmsStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Webhook, Plus, Trash2, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function Integrations() {
  const { webhooks, addWebhook, deleteWebhook } = useLmsStore()
  const [open, setOpen] = useState(false)
  const [newHook, setNewHook] = useState<Partial<WebhookConfig>>({
    url: '',
    events: ['course_completed'],
  })

  const handleSave = () => {
    if (!newHook.url?.startsWith('http')) return toast.error('Insira uma URL válida (http/https).')
    if (!newHook.events?.length) return toast.error('Selecione ao menos um evento.')

    addWebhook({
      id: `wh_${Date.now()}`,
      url: newHook.url,
      events: newHook.events,
    })
    toast.success('Webhook criado com sucesso. Integração ativa.')
    setOpen(false)
  }

  return (
    <div className="space-y-8 max-w-4xl pb-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrações (Webhooks)</h1>
          <p className="text-muted-foreground mt-1">
            Envie dados automaticamente para ferramentas externas (CRM, Marketing, ERP).
          </p>
        </div>
        <Button
          onClick={() => {
            setNewHook({ url: '', events: ['course_completed'] })
            setOpen(true)
          }}
        >
          <Plus className="mr-2 size-4" /> Novo Webhook
        </Button>
      </div>

      <div className="grid gap-4">
        {webhooks.map((w) => (
          <Card key={w.id}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <Globe className="size-6" />
                </div>
                <div>
                  <p className="font-semibold text-lg text-foreground">{w.url}</p>
                  <div className="flex gap-2 mt-2">
                    {w.events.map((ev) => (
                      <span
                        key={ev}
                        className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded uppercase font-medium tracking-wide"
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => deleteWebhook(w.id)}
              >
                <Trash2 className="size-5" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {webhooks.length === 0 && (
          <div className="border-2 border-dashed rounded-xl p-12 text-center text-muted-foreground">
            <Webhook className="size-12 mx-auto mb-4 opacity-20" />
            <p>Nenhuma integração ativa no momento.</p>
            <Button variant="link" onClick={() => setOpen(true)} className="mt-2">
              Criar a primeira
            </Button>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Novo Webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Endpoint URL (POST)</Label>
              <Input
                placeholder="https://api.seusistema.com/webhook"
                value={newHook.url}
                onChange={(e) => setNewHook({ ...newHook, url: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <Label>Eventos Gatilho</Label>
              <div className="space-y-2 border p-4 rounded-lg bg-muted/20">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ev-course"
                    checked={newHook.events?.includes('course_completed')}
                    onCheckedChange={(c) => {
                      let evts = newHook.events || []
                      evts = c
                        ? [...evts, 'course_completed']
                        : evts.filter((x) => x !== 'course_completed')
                      setNewHook({ ...newHook, events: evts })
                    }}
                  />
                  <Label htmlFor="ev-course" className="font-normal">
                    Course Completed (Aluno finalizou o curso)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ev-enroll"
                    checked={newHook.events?.includes('enrollment')}
                    onCheckedChange={(c) => {
                      let evts = newHook.events || []
                      evts = c ? [...evts, 'enrollment'] : evts.filter((x) => x !== 'enrollment')
                      setNewHook({ ...newHook, events: evts })
                    }}
                  />
                  <Label htmlFor="ev-enroll" className="font-normal">
                    Enrollment Created (Nova matrícula realizada)
                  </Label>
                </div>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={handleSave}>
              Salvar e Ativar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
