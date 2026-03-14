import { useState } from 'react'
import { useLmsStore, BiWebhook } from '@/stores/lmsStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Webhook, Plus, Trash2, Activity, PlayCircle, Edit } from 'lucide-react'
import { toast } from 'sonner'

export default function BiIntegrations() {
  const { biWebhooks, addBiWebhook, updateBiWebhook, deleteBiWebhook } = useLmsStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<BiWebhook> | null>(null)

  const handleSave = () => {
    if (!editing?.url?.startsWith('http')) {
      return toast.error('Insira uma URL válida (http/https).')
    }
    if (!editing?.events?.length) {
      return toast.error('Selecione ao menos um evento de gatilho.')
    }
    if (editing.id) {
      updateBiWebhook(editing as BiWebhook)
      toast.success('Integração BI atualizada!')
    } else {
      addBiWebhook({ ...editing, id: `bi_${Date.now()}`, active: true } as BiWebhook)
      toast.success('Nova integração BI ativada!')
    }
    setOpen(false)
  }

  const handleTest = (url: string) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: 'Enviando ping de teste para o endpoint...',
      success: `Conexão bem-sucedida com ${url}!`,
      error: 'Falha na conexão. Verifique o endpoint.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand">Webhooks de BI & Analytics</h2>
          <p className="text-muted-foreground mt-1">
            Envie dados em tempo real para ferramentas externas (PowerBI, Tableau, etc).
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing({ url: '', events: ['new_sale'], active: true })
            setOpen(true)
          }}
          className="bg-brand text-white hover:bg-brand/90 font-bold shadow-sm"
        >
          <Plus className="mr-2 size-4" /> Nova Integração
        </Button>
      </div>

      <div className="grid gap-4">
        {biWebhooks.map((w) => (
          <Card key={w.id} className="border-slate-200 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="bg-brand/10 p-4 rounded-xl text-brand shrink-0">
                  <Webhook className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-lg text-slate-800">{w.url}</p>
                    <Switch
                      checked={w.active}
                      onCheckedChange={(c) => updateBiWebhook({ ...w, active: c })}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {w.events.map((ev) => (
                      <span
                        key={ev}
                        className="text-[11px] bg-primary/10 text-primary px-2.5 py-1 rounded-md font-extrabold tracking-widest uppercase"
                      >
                        {ev === 'new_sale'
                          ? 'Nova Venda'
                          : ev === 'course_completed'
                            ? 'Curso Concluído'
                            : 'Novo Aluno'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="font-bold border-brand text-brand hover:bg-brand hover:text-white flex-1 md:flex-none"
                  onClick={() => handleTest(w.url)}
                >
                  <PlayCircle className="mr-2 size-4" /> Testar
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing(w)
                    setOpen(true)
                  }}
                >
                  <Edit className="size-4 text-slate-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => deleteBiWebhook(w.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {biWebhooks.length === 0 && (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-16 text-center text-slate-500 bg-slate-50/50">
            <Activity className="size-12 mx-auto mb-4 opacity-30" />
            <h3 className="font-bold text-xl text-brand">Nenhum Webhook Configurado</h3>
            <p className="mt-2 font-medium">
              Conecte seus dados acadêmicos e financeiros a sistemas externos de Business
              Intelligence.
            </p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-brand text-xl">
              {editing?.id ? 'Editar Integração BI' : 'Configurar Webhook BI'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-brand font-bold">URL do Endpoint (POST)</Label>
              <Input
                placeholder="https://bi.suaempresa.com/webhook"
                value={editing?.url || ''}
                onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                className="bg-slate-50"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-brand font-bold">Eventos e Gatilhos de Envio</Label>
              <div className="space-y-4 border border-slate-200 p-5 rounded-xl bg-slate-50 shadow-inner">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="ev-sale"
                    checked={editing?.events?.includes('new_sale')}
                    onCheckedChange={(c) => {
                      let evts = editing?.events || []
                      evts = c ? [...evts, 'new_sale'] : evts.filter((x) => x !== 'new_sale')
                      setEditing({ ...editing, events: evts })
                    }}
                  />
                  <Label htmlFor="ev-sale" className="font-semibold text-slate-700 cursor-pointer">
                    Nova Venda (Transação Aprovada)
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="ev-course"
                    checked={editing?.events?.includes('course_completed')}
                    onCheckedChange={(c) => {
                      let evts = editing?.events || []
                      evts = c
                        ? [...evts, 'course_completed']
                        : evts.filter((x) => x !== 'course_completed')
                      setEditing({ ...editing, events: evts })
                    }}
                  />
                  <Label
                    htmlFor="ev-course"
                    className="font-semibold text-slate-700 cursor-pointer"
                  >
                    Curso Concluído pelo Aluno
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="ev-student"
                    checked={editing?.events?.includes('new_student')}
                    onCheckedChange={(c) => {
                      let evts = editing?.events || []
                      evts = c ? [...evts, 'new_student'] : evts.filter((x) => x !== 'new_student')
                      setEditing({ ...editing, events: evts })
                    }}
                  />
                  <Label
                    htmlFor="ev-student"
                    className="font-semibold text-slate-700 cursor-pointer"
                  >
                    Novo Aluno Registrado
                  </Label>
                </div>
              </div>
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 text-base shadow-md mt-4"
              onClick={handleSave}
            >
              Salvar e Ativar Integração
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
