import { useState } from 'react'
import { useCommercialStore, Coupon } from '@/stores/commercialStore'
import { useLmsStore } from '@/stores/lmsStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Edit, Trash2, Tag, Layers } from 'lucide-react'
import { toast } from 'sonner'

export default function CouponsTab() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCommercialStore()
  const { courses } = useLmsStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<Coupon> | null>(null)

  const handleSave = () => {
    if (!editing?.code || !editing?.type || !editing?.value) {
      return toast.error('Preencha os campos obrigatórios.')
    }
    const payload = {
      ...editing,
      code: editing.code.toUpperCase().replace(/\s/g, ''),
      id: editing.id || `cp_${Date.now()}`,
      isActive: editing.isActive ?? true,
      currentUses: editing.currentUses || 0,
      validCourseIds: editing.validCourseIds || [],
    } as Coupon

    if (editing.id) updateCoupon(payload)
    else addCoupon(payload)

    toast.success('Cupom promocional salvo com sucesso!')
    setOpen(false)
  }

  const toggleCourse = (courseId: string, checked: boolean) => {
    const current = editing?.validCourseIds || []
    if (checked) {
      setEditing({ ...editing, validCourseIds: [...current, courseId] })
    } else {
      setEditing({ ...editing, validCourseIds: current.filter((id) => id !== courseId) })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Tag className="size-5 text-brand" /> Cupons de Desconto
          </CardTitle>
          <CardDescription>
            Crie códigos promocionais e restrinja uso por curso ou volume.
          </CardDescription>
        </div>
        <Button
          onClick={() => {
            setEditing({
              type: 'percentage',
              value: 0,
              isActive: true,
              code: '',
              currentUses: 0,
              validCourseIds: [],
            })
            setOpen(true)
          }}
        >
          <Plus className="mr-2 size-4" /> Novo Cupom
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Tipo / Valor</TableHead>
              <TableHead>Cursos Válidos</TableHead>
              <TableHead>Uso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-bold text-brand font-mono">{c.code}</TableCell>
                <TableCell>
                  <div className="font-semibold text-primary">
                    {c.type === 'percentage' ? `${c.value}%` : `R$ ${c.value.toFixed(2)}`}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {c.type === 'percentage' ? 'Desconto (%)' : 'Valor Fixo'}
                  </div>
                </TableCell>
                <TableCell>
                  {c.validCourseIds?.length ? (
                    <Badge variant="secondary" className="flex items-center gap-1 w-max">
                      <Layers className="size-3" /> {c.validCourseIds.length} Cursos
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      Todos
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">
                    {c.currentUses} / {c.maxUses || '∞'}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={c.isActive}
                    onCheckedChange={(val) => updateCoupon({ ...c, isActive: val })}
                  />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(c)
                      setOpen(true)
                    }}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => deleteCoupon(c.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {coupons.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhum cupom cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Editar Cupom' : 'Novo Cupom'}</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Código Promocional</Label>
                <Input
                  value={editing?.code || ''}
                  onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                  placeholder="Ex: MAISSEGURANCA"
                  className="uppercase font-mono font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Desconto</Label>
                  <Select
                    value={editing?.type}
                    onValueChange={(v) =>
                      setEditing({ ...editing, type: v as 'percentage' | 'fixed' })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor</Label>
                  <Input
                    type="number"
                    value={editing?.value || ''}
                    onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })}
                    placeholder="Ex: 20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Limite de Usos (Volume Máximo)</Label>
                <Input
                  type="number"
                  value={editing?.maxUses || ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      maxUses: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  placeholder="Deixe em branco para ilimitado"
                />
                <p className="text-xs text-muted-foreground">
                  Usos atuais: {editing?.currentUses || 0}
                </p>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  checked={editing?.isActive}
                  onCheckedChange={(c) => setEditing({ ...editing, isActive: c })}
                />
                <Label>Cupom Ativo (Pronto para uso)</Label>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Restringir a Cursos Específicos</Label>
                <p className="text-xs text-muted-foreground mb-2 mt-1">
                  Se nenhum curso for selecionado, o cupom será válido para toda a loja.
                </p>
              </div>
              <div className="border rounded-md bg-muted/20">
                <ScrollArea className="h-[240px] p-4">
                  <div className="space-y-3">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={`course-${course.id}`}
                          checked={editing?.validCourseIds?.includes(course.id)}
                          onCheckedChange={(checked) => toggleCourse(course.id, checked as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={`course-${course.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {course.title}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            R$ {course.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {courses.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum curso cadastrado.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
          <Button className="w-full mt-2" size="lg" onClick={handleSave}>
            Salvar Cupom
          </Button>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
