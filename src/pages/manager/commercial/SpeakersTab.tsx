import { useState } from 'react'
import { useCommercialStore, Speaker, SpeakerType } from '@/stores/commercialStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function SpeakersTab() {
  const { speakers, addSpeaker, updateSpeaker, deleteSpeaker } = useCommercialStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<Speaker> | null>(null)

  const handleSave = () => {
    if (!editing?.name || !editing?.type) {
      return toast.error('Preencha os campos obrigatórios.')
    }
    const payload = {
      ...editing,
      id: editing.id || `sp_${Date.now()}`,
    } as Speaker

    if (editing.id) updateSpeaker(payload)
    else addSpeaker(payload)

    toast.success('Palestrante salvo com sucesso!')
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Cadastro de Palestrantes</CardTitle>
          <CardDescription>
            Gerencie autores e especialistas associados aos produtos.
          </CardDescription>
        </div>
        <Button
          onClick={() => {
            setEditing({ type: 'internal', name: '', bio: '', avatar: '' })
            setOpen(true)
          }}
        >
          <Plus className="mr-2 size-4" /> Novo Palestrante
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identificação</TableHead>
              <TableHead>Designação (Tipo)</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {speakers.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="flex items-center gap-3">
                  <img
                    src={s.avatar || `https://img.usecurling.com/ppl/thumbnail?seed=${s.id}`}
                    className="size-8 rounded-full object-cover"
                    alt=""
                  />
                  <span className="font-medium">{s.name}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={s.type === 'internal' ? 'default' : 'secondary'}>
                    {s.type === 'internal'
                      ? 'Observatório Nacional de Segurança Viária'
                      : 'Especialista Externo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(s)
                      setOpen(true)
                    }}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => deleteSpeaker(s.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {speakers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  Nenhum palestrante cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Editar Palestrante' : 'Novo Palestrante'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input
                value={editing?.name || ''}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Designação</Label>
              <Select
                value={editing?.type}
                onValueChange={(v) => setEditing({ ...editing, type: v as SpeakerType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">
                    Observatório Nacional de Segurança Viária
                  </SelectItem>
                  <SelectItem value="external">Especialista Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Minibiografia</Label>
              <Textarea
                value={editing?.bio || ''}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>URL do Avatar / Foto</Label>
              <Input
                value={editing?.avatar || ''}
                onChange={(e) => setEditing({ ...editing, avatar: e.target.value })}
              />
            </div>
            <Button className="w-full mt-4" onClick={handleSave}>
              Salvar Palestrante
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
