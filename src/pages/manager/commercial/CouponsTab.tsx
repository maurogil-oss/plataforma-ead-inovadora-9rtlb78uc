import { useState } from 'react'
import { useCommercialStore, Coupon } from '@/stores/commercialStore'
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
import { Plus, Edit, Trash2, Tag } from 'lucide-react'
import { toast } from 'sonner'

export default function CouponsTab() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCommercialStore()
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
    } as Coupon

    if (editing.id) updateCoupon(payload)
    else addCoupon(payload)

    toast.success('Cupom promocional salvo com sucesso!')
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Tag className="size-5 text-brand" /> Cupons de Desconto
          </CardTitle>
          <CardDescription>
            Crie códigos promocionais para impulsionar as vendas da plataforma.
          </CardDescription>
        </div>
        <Button
          onClick={() => {
            setEditing({ type: 'percentage', value: 0, isActive: true, code: '' })
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
              <TableHead>Tipo</TableHead>
              <TableHead>Valor do Desconto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-bold text-brand font-mono">{c.code}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="uppercase text-[10px]">
                    {c.type === 'percentage' ? 'Porcentagem (%)' : 'Valor Fixo (R$)'}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">
                  {c.type === 'percentage' ? `${c.value}%` : `R$ ${c.value.toFixed(2)}`}
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
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhum cupom cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Editar Cupom' : 'Novo Cupom'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
            <div className="flex items-center space-x-2 pt-4">
              <Switch
                checked={editing?.isActive}
                onCheckedChange={(c) => setEditing({ ...editing, isActive: c })}
              />
              <Label>Cupom Ativo (Pronto para uso)</Label>
            </div>
            <Button className="w-full mt-4" size="lg" onClick={handleSave}>
              Salvar Cupom
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
