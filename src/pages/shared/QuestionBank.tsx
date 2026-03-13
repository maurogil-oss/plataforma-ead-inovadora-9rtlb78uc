import { useState } from 'react'
import { useLmsStore, BankQuestion, QuestionType } from '@/stores/lmsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Edit } from 'lucide-react'

export default function QuestionBank() {
  const { bankQuestions, addBankQuestion, deleteBankQuestion } = useLmsStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<BankQuestion> | null>(null)

  const handleSave = () => {
    if (!editing?.text || !editing?.category) return
    const q = { ...editing, id: editing.id || `bq_${Date.now()}` } as BankQuestion
    addBankQuestion(q) // Simple add/replace for mock
    setOpen(false)
  }

  const openNew = () => {
    setEditing({
      type: 'single',
      category: '',
      text: '',
      difficulty: 'medium',
      options: ['Opção 1'],
      correctOptionIndex: 0,
      correctOptions: [],
    })
    setOpen(true)
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banco de Questões</h1>
          <p className="text-muted-foreground mt-1">Gerencie perguntas para provas dinâmicas.</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 size-4" /> Nova Questão
        </Button>
      </div>

      <div className="grid gap-4">
        {bankQuestions.map((q) => (
          <Card key={q.id}>
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Badge variant="outline">{q.category}</Badge>
                  <Badge variant="secondary" className="uppercase text-[10px]">
                    {q.type}
                  </Badge>
                  <Badge className="uppercase text-[10px]">{q.difficulty}</Badge>
                </div>
                <p className="font-medium text-foreground">{q.text}</p>
                {q.type !== 'essay' && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {q.options?.length} opções cadastradas
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive shrink-0"
                onClick={() => deleteBankQuestion(q.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Questão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Tipo</label>
                <Select
                  value={editing?.type}
                  onValueChange={(v) => setEditing({ ...editing, type: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Múltipla Escolha (1 Certa)</SelectItem>
                    <SelectItem value="multiple">Múltiplas Alternativas</SelectItem>
                    <SelectItem value="essay">Dissertativa / Redação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Categoria</label>
                <Input
                  value={editing?.category || ''}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Dificuldade</label>
                <Select
                  value={editing?.difficulty || 'medium'}
                  onValueChange={(v) => setEditing({ ...editing, difficulty: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Enunciado</label>
              <Textarea
                value={editing?.text || ''}
                onChange={(e) => setEditing({ ...editing, text: e.target.value })}
              />
            </div>

            {editing?.type !== 'essay' && (
              <div className="space-y-2 border p-4 rounded bg-muted/20">
                <p className="text-sm font-semibold">Alternativas</p>
                {editing?.options?.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {editing.type === 'multiple' ? (
                      <Checkbox
                        checked={editing.correctOptions?.includes(i)}
                        onCheckedChange={(c) => {
                          let arr = editing.correctOptions || []
                          arr = c ? [...arr, i] : arr.filter((x) => x !== i)
                          setEditing({ ...editing, correctOptions: arr })
                        }}
                      />
                    ) : (
                      <input
                        type="radio"
                        checked={editing.correctOptionIndex === i}
                        onChange={() => setEditing({ ...editing, correctOptionIndex: i })}
                        className="size-4"
                      />
                    )}
                    <Input
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...(editing.options || [])]
                        newOpts[i] = e.target.value
                        setEditing({ ...editing, options: newOpts })
                      }}
                    />
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setEditing({ ...editing, options: [...(editing?.options || []), 'Nova'] })
                  }
                >
                  Adicionar Opção
                </Button>
              </div>
            )}
            <Button className="w-full" onClick={handleSave}>
              Salvar Questão
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
