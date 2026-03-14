import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useLmsStore, LiveClass } from '@/stores/lmsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { Badge } from '@/components/ui/badge'
import { Video, Plus, Trash2, Edit, ExternalLink, Link as LinkIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function LiveClasses() {
  const user = useAuthStore((s) => s.user)
  const { liveClasses, courses, addLiveClass, updateLiveClass, deleteLiveClass } = useLmsStore()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<LiveClass> | null>(null)

  const myCourses =
    user?.role === 'instructor' ? courses.filter((c) => c.instructorId === user.id) : courses
  const myCourseIds = myCourses.map((c) => c.id)
  const myLiveClasses = liveClasses
    .filter((lc) => myCourseIds.includes(lc.courseId))
    .sort(
      (a, b) =>
        new Date(`${b.date}T${b.startTime}`).getTime() -
        new Date(`${a.date}T${a.startTime}`).getTime(), // Sort newest first for recordings
    )

  const handleSave = () => {
    if (
      !editing?.title ||
      !editing?.courseId ||
      !editing?.url ||
      !editing?.date ||
      !editing?.startTime
    ) {
      return toast.error('Preencha todos os campos obrigatórios.')
    }

    if (editing.id) {
      updateLiveClass(editing as LiveClass)
      toast.success('Aula atualizada.')
    } else {
      addLiveClass({ ...editing, id: `lc_${Date.now()}` } as LiveClass)
      toast.success('Aula agendada com sucesso.')
    }
    setOpen(false)
  }

  const openNew = () => {
    setEditing({
      title: '',
      description: '',
      platform: 'meet',
      url: '',
      durationMinutes: 60,
      date: '',
      startTime: '',
      recordingUrl: '',
    })
    setOpen(true)
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Aulas ao Vivo</h1>
          <p className="text-muted-foreground mt-1">
            Agende sessões interativas e adicione links de gravação após a aula.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 size-4" /> Agendar Aula
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Título / Curso</TableHead>
              <TableHead>Data e Hora</TableHead>
              <TableHead>Gravação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myLiveClasses.map((lc) => {
              const course = courses.find((c) => c.id === lc.courseId)
              const start = new Date(`${lc.date}T${lc.startTime}`)
              const end = new Date(start.getTime() + lc.durationMinutes * 60000)
              const now = new Date()
              const isLive = now >= start && now <= end
              const isPast = now > end

              return (
                <TableRow key={lc.id}>
                  <TableCell>
                    {isLive ? (
                      <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">Ao Vivo</Badge>
                    ) : isPast ? (
                      <Badge variant="secondary">Finalizada</Badge>
                    ) : (
                      <Badge variant="outline" className="border-primary text-primary">
                        Agendada
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium line-clamp-1">{lc.title}</div>
                    <div className="text-xs text-muted-foreground">{course?.title}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {new Date(lc.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {lc.startTime} ({lc.durationMinutes} min)
                    </div>
                  </TableCell>
                  <TableCell>
                    {lc.recordingUrl ? (
                      <a
                        href={lc.recordingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs flex items-center text-primary hover:underline"
                      >
                        <LinkIcon className="mr-1 size-3" /> Disponível
                      </a>
                    ) : isPast ? (
                      <span className="text-xs text-muted-foreground italic">Sem gravação</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={lc.url} target="_blank" rel="noreferrer" title="Testar Sala">
                          <ExternalLink className="size-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(lc)
                          setOpen(true)
                        }}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteLiveClass(lc.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {myLiveClasses.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma aula ao vivo agendada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Editar Aula' : 'Nova Aula ao Vivo'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="space-y-2">
              <Label>Curso Relacionado</Label>
              <Select
                value={editing?.courseId || ''}
                onValueChange={(v) => setEditing({ ...editing, courseId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um curso..." />
                </SelectTrigger>
                <SelectContent>
                  {myCourses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Título da Sessão</Label>
              <Input
                value={editing?.title || ''}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="Ex: Aula Inaugural"
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={editing?.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plataforma</Label>
                <Select
                  value={editing?.platform || 'meet'}
                  onValueChange={(v) => setEditing({ ...editing, platform: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meet">Google Meet</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="teams">MS Teams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Link da Reunião</Label>
                <Input
                  value={editing?.url || ''}
                  onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={editing?.date || ''}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-1">
                <Label>Horário (Início)</Label>
                <Input
                  type="time"
                  value={editing?.startTime || ''}
                  onChange={(e) => setEditing({ ...editing, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-1">
                <Label>Duração (min)</Label>
                <Input
                  type="number"
                  value={editing?.durationMinutes || 60}
                  onChange={(e) =>
                    setEditing({ ...editing, durationMinutes: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t">
              <Label className="text-primary">URL da Gravação (Opcional)</Label>
              <Input
                value={editing?.recordingUrl || ''}
                onChange={(e) => setEditing({ ...editing, recordingUrl: e.target.value })}
                placeholder="Insira o link após a aula para os alunos assistirem..."
              />
            </div>
            <Button className="w-full mt-4" size="lg" onClick={handleSave}>
              Salvar Sessão
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
