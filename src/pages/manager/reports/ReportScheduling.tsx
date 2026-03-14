import { useState } from 'react'
import { useLmsStore, ReportSchedule } from '@/stores/lmsStore'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, Trash2, Mail } from 'lucide-react'
import { toast } from 'sonner'

export default function ReportScheduling() {
  const { reportSchedules, addReportSchedule, updateReportSchedule, deleteReportSchedule } =
    useLmsStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<ReportSchedule> | null>(null)

  const handleSave = () => {
    if (!editing?.type || !editing?.frequency || !editing?.emails) {
      return toast.error('Preencha todos os campos obrigatórios.')
    }
    if (editing.id) {
      updateReportSchedule(editing as ReportSchedule)
      toast.success('Agendamento atualizado com sucesso!')
    } else {
      addReportSchedule({ ...editing, id: `sched_${Date.now()}`, active: true } as ReportSchedule)
      toast.success('Novo agendamento criado!')
    }
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand">Agendamento de Relatórios</h2>
          <p className="text-muted-foreground mt-1">Configure envios automáticos por email.</p>
        </div>
        <Button
          onClick={() => {
            setEditing({ type: 'financial', frequency: 'weekly', emails: '' })
            setOpen(true)
          }}
          className="bg-brand text-white hover:bg-brand/90 font-bold"
        >
          <Plus className="mr-2 size-4" /> Novo Agendamento
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold text-brand">Status</TableHead>
              <TableHead className="font-bold text-brand">Tipo de Relatório</TableHead>
              <TableHead className="font-bold text-brand">Frequência</TableHead>
              <TableHead className="font-bold text-brand">Destinatários</TableHead>
              <TableHead className="text-right font-bold text-brand">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportSchedules.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <Switch
                    checked={s.active}
                    onCheckedChange={(c) => updateReportSchedule({ ...s, active: c })}
                  />
                </TableCell>
                <TableCell className="font-semibold text-slate-800">
                  {s.type === 'financial'
                    ? 'Resumo Financeiro'
                    : s.type === 'academic'
                      ? 'Progresso Acadêmico'
                      : 'Vendas Gerais'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="uppercase tracking-wide text-[10px] bg-white">
                    {s.frequency === 'daily'
                      ? 'Diário'
                      : s.frequency === 'weekly'
                        ? 'Semanal'
                        : 'Mensal'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-600 flex items-center gap-2 font-medium">
                  <Mail className="size-4 text-primary" />{' '}
                  <span className="line-clamp-1">{s.emails}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(s)
                      setOpen(true)
                    }}
                  >
                    <Edit className="size-4 text-brand" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => deleteReportSchedule(s.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {reportSchedules.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground font-medium"
                >
                  Nenhum agendamento configurado no momento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-brand text-xl">
              {editing?.id ? 'Editar Agendamento' : 'Novo Agendamento'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-brand font-bold">Tipo de Relatório</Label>
              <Select
                value={editing?.type}
                onValueChange={(v) => setEditing({ ...editing, type: v as any })}
              >
                <SelectTrigger className="bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Resumo Financeiro</SelectItem>
                  <SelectItem value="academic">Progresso Acadêmico</SelectItem>
                  <SelectItem value="sales">Vendas Gerais</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-brand font-bold">Frequência de Envio</Label>
              <Select
                value={editing?.frequency}
                onValueChange={(v) => setEditing({ ...editing, frequency: v as any })}
              >
                <SelectTrigger className="bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal (Segunda-feira)</SelectItem>
                  <SelectItem value="monthly">Mensal (Dia 1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-brand font-bold">Emails dos Destinatários</Label>
              <Input
                placeholder="email1@exemplo.com, email2@exemplo.com"
                value={editing?.emails || ''}
                onChange={(e) => setEditing({ ...editing, emails: e.target.value })}
                className="bg-slate-50"
              />
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Separe múltiplos emails por vírgula.
              </p>
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 text-base shadow-md mt-4"
              onClick={handleSave}
            >
              Salvar Configuração
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
