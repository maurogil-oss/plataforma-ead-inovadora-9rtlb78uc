import { useState } from 'react'
import { useLmsStore, ExamSubmission } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function GradeExams() {
  const user = useAuthStore((s) => s.user)
  const { enrollments, courses, students, gradeExam } = useLmsStore()
  const [selected, setSelected] = useState<{
    enrollmentId: string
    sub: ExamSubmission
    cTitle: string
    sName: string
  } | null>(null)
  const [score, setScore] = useState<number>(0)
  const [feedback, setFeedback] = useState('')

  const myCourses = courses.filter((c) => c.instructorId === user?.id)
  const myCourseIds = myCourses.map((c) => c.id)

  const pendings: any[] = []
  enrollments.forEach((e) => {
    if (!myCourseIds.includes(e.courseId)) return
    Object.values(e.examSubmissions).forEach((sub) => {
      if (sub.isPending) {
        pendings.push({
          enrollmentId: e.id,
          sub,
          cTitle: myCourses.find((c) => c.id === e.courseId)?.title,
          sName: students.find((s) => s.id === e.studentId)?.name,
        })
      }
    })
  })

  const openGrade = (item: any) => {
    setSelected(item)
    setScore(0)
    setFeedback('')
  }

  const handleSave = () => {
    if (!selected) return
    gradeExam(selected.enrollmentId, selected.sub.lessonId, score, feedback)
    toast.success('Nota atribuída com sucesso!')
    setSelected(null)
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Correção de Provas</h1>
        <p className="text-muted-foreground mt-1">Avalie as respostas dissertativas dos alunos.</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Questões Abertas</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendings.map((p, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{p.sName}</TableCell>
                <TableCell>{p.cTitle}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {p.sub.questions.filter((q: any) => q.type === 'essay').length} pendentes
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" onClick={() => openGrade(p)}>
                    Avaliar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {pendings.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhuma prova pendente de correção.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Avaliar Aluno: {selected?.sName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-semibold">
                Nota Automática (Múltipla Escolha): {selected?.sub.autoScore.toFixed(1)} pts
              </p>
            </div>

            {selected?.sub.questions.map((q, i) => {
              if (q.type !== 'essay') return null
              return (
                <div key={q.id} className="border p-4 rounded-lg space-y-3 bg-card">
                  <p className="font-semibold text-sm">Pergunta:</p>
                  <p className="bg-muted/50 p-3 rounded">{q.text}</p>
                  <p className="font-semibold text-sm mt-4">Resposta do Aluno:</p>
                  <p className="bg-primary/5 p-4 rounded text-foreground whitespace-pre-wrap">
                    {selected.sub.answers[q.id] || (
                      <span className="italic opacity-50">Em branco</span>
                    )}
                  </p>
                </div>
              )
            })}

            <div className="space-y-4 border-t pt-6">
              <div className="space-y-2">
                <label className="font-semibold">
                  Nota atribuída às questões abertas (0 a 100)
                </label>
                <Input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-32 text-lg font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="font-semibold">Feedback para o Aluno</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Muito bem construído o argumento..."
                />
              </div>
              <Button size="lg" className="w-full" onClick={handleSave}>
                Salvar e Concluir Avaliação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
