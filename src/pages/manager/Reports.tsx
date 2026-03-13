import { useLmsStore } from '@/stores/lmsStore'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { toast } from 'sonner'

export default function Reports() {
  const { enrollments, students, courses } = useLmsStore()

  const handleExport = (type: string) =>
    toast.success(`Relatório exportado para ${type} com sucesso!`)

  const data = enrollments.map((e) => {
    const student = students.find((s) => s.id === e.studentId)
    const course = courses.find((c) => c.id === e.courseId)
    const batch = course?.batches?.find((b) => b.id === e.batchId)

    const totalLessons = course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0
    const progress =
      totalLessons > 0 ? Math.round((e.completedLessons.length / totalLessons) * 100) : 0

    const exams = course?.modules.flatMap((m) => m.lessons.filter((l) => l.type === 'exam')) || []
    let avgGrade = 100
    if (exams.length > 0) {
      avgGrade = exams.reduce((acc, exam) => acc + (e.examScores[exam.id] || 0), 0) / exams.length
    }
    const timeSpent = e.activityLog.reduce((acc, act) => acc + (act.timeSpentMinutes || 0), 0)

    return {
      id: e.id,
      studentName: student?.name,
      studentEmail: student?.email,
      courseTitle: course?.title,
      batchName: batch?.name || 'Acesso Livre',
      progress,
      avgGrade,
      timeSpent,
    }
  })

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios de Desempenho</h1>
          <p className="text-muted-foreground mt-1">Estatísticas detalhadas de evolução e notas.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('CSV')}>
            <Download className="mr-2 size-4" /> Exportar CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('PDF')}>
            <Download className="mr-2 size-4" /> Exportar PDF
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Curso / Turma</TableHead>
                <TableHead className="text-center">Progresso</TableHead>
                <TableHead className="text-center">Nota Média</TableHead>
                <TableHead className="text-right">Tempo de Estudo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="font-medium">{row.studentName}</div>
                    <div className="text-xs text-muted-foreground">{row.studentEmail}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{row.courseTitle}</div>
                    <div className="text-xs text-muted-foreground">{row.batchName}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded font-medium text-xs">
                      {row.progress}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-bold">{row.avgGrade.toFixed(1)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {Math.floor(row.timeSpent / 60)}h {row.timeSpent % 60}m
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum dado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
