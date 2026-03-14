import { useState } from 'react'
import { useCommercialStore, Product, ProductType } from '@/stores/commercialStore'
import { useLmsStore } from '@/stores/lmsStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductsTab() {
  const { products, speakers, addProduct, updateProduct, deleteProduct } = useCommercialStore()
  const { courses } = useLmsStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<Product> | null>(null)

  const handleSave = () => {
    if (!editing?.title || !editing?.type || !editing?.price) {
      return toast.error('Preencha os campos obrigatórios.')
    }
    const payload = {
      ...editing,
      id: editing.id || `prod_${Date.now()}`,
      isPublished: editing.isPublished ?? false,
    } as Product

    if (editing.id) updateProduct(payload)
    else addProduct(payload)

    toast.success('Produto salvo com sucesso!')
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Catálogo de Produtos</CardTitle>
          <CardDescription>Gerencie eBooks, cursos e futuros lançamentos.</CardDescription>
        </div>
        <Button
          onClick={() => {
            setEditing({ type: 'ebook', price: 0, isPublished: false, coverImage: '' })
            setOpen(true)
          }}
        >
          <Plus className="mr-2 size-4" /> Novo Produto
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="uppercase text-[10px]">
                    {p.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {p.promotionalPrice ? (
                    <div>
                      <span className="font-bold text-primary mr-2">
                        R$ {p.promotionalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs line-through text-muted-foreground">
                        R$ {p.price.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-bold">R$ {p.price.toFixed(2)}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={p.isPublished}
                    onCheckedChange={(c) => updateProduct({ ...p, isPublished: c })}
                  />
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(p)
                      setOpen(true)
                    }}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => deleteProduct(p.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título do Produto</Label>
                <Input
                  value={editing?.title || ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Produto</Label>
                <Select
                  value={editing?.type}
                  onValueChange={(v) => setEditing({ ...editing, type: v as ProductType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ebook">E-Book Digital</SelectItem>
                    <SelectItem value="course">Curso Online</SelectItem>
                    <SelectItem value="expansion1">Futuro: Mentoria</SelectItem>
                    <SelectItem value="expansion2">Futuro: Eventos</SelectItem>
                    <SelectItem value="expansion3">Futuro: Consultoria</SelectItem>
                    <SelectItem value="expansion4">Futuro: Certificação</SelectItem>
                    <SelectItem value="expansion5">Futuro: Comunidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={editing?.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preço Regular (R$)</Label>
                <Input
                  type="number"
                  value={editing?.price || ''}
                  onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Preço Promocional (Opcional)</Label>
                <Input
                  type="number"
                  value={editing?.promotionalPrice || ''}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      promotionalPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL da Imagem de Capa</Label>
              <Input
                value={editing?.coverImage || ''}
                onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Palestrante / Autor Associado</Label>
              <Select
                value={editing?.speakerId || 'none'}
                onValueChange={(v) =>
                  setEditing({ ...editing, speakerId: v === 'none' ? undefined : v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um palestrante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {speakers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {editing?.type === 'ebook' && (
              <div className="space-y-2">
                <Label>URL do Arquivo (PDF/ePub)</Label>
                <Input
                  value={editing?.fileUrl || ''}
                  onChange={(e) => setEditing({ ...editing, fileUrl: e.target.value })}
                />
              </div>
            )}
            {editing?.type === 'course' && (
              <div className="space-y-2">
                <Label>Vincular a um Curso da Plataforma</Label>
                <Select
                  value={editing?.courseId || 'none'}
                  onValueChange={(v) =>
                    setEditing({ ...editing, courseId: v === 'none' ? undefined : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center space-x-2 pt-4">
              <Switch
                checked={editing?.isPublished}
                onCheckedChange={(c) => setEditing({ ...editing, isPublished: c })}
              />
              <Label>Publicar Produto na Loja</Label>
            </div>
            <Button className="w-full mt-4" size="lg" onClick={handleSave}>
              Salvar Produto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
