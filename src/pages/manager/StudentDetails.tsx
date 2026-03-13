import { useParams, Link } from 'react-router-dom'
import { useLmsStore } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Clock, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function StudentDetails() {
  const { id } = useParams()
  const user = useAuthStore((s) => s.user)
  const { students, enrollments, courses } = useLmsStore()
  const student = students.find((s) => s.id === id)

  if (!student) return <div className="p-8 text-center">Aluno não encontrado</div>

  const basePath = user?.role === 'instructor' ? '/instructor' : '/manager'

  let studentEnrollments = enrollments.filter((e) => e.studentId === id)

  if (user?.role === 'instructor') {
    const myCourseIds = courses.filter((c) => c.instructorId === user.id).map((c) => c.id)
    studentEnrollments = studentEnrollments.filter((e) => myCourseIds.includes(e.courseId))
  }

  const allActivities = studentEnrollments
    .flatMap((e) =>
      e.activityLog.map((act) => ({
        ...act,
        courseTitle: courses.find((c) => c.id === e.courseId)?.title || 'Curso Removido',
      })),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalTimeSpent = allActivities.reduce((acc, act) => acc + (act.timeSpentMinutes || 0), 0)

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`${basePath}/enrollments`}>
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
          <p className="text-muted-foreground">{student.email}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cursos Matriculados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{studentEnrollments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo Estimado de Estudo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {Math.floor(totalTimeSpent / 60)}h {totalTimeSpent % 60}m
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5 text-primary" /> Log de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <div className="font-medium text-foreground">
                    {act.type === 'enrollment'
                      ? 'Matrícula Realizada'
                      : act.type === 'lesson_complete'
                        ? 'Aula Concluída'
                        : act.type === 'exam_graded'
                          ? 'Prova Corrigida'
                          : 'Tentativa de Prova'}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {act.details} <span className="font-medium ml-1">({act.courseTitle})</span>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-muted-foreground font-mono">
                    {new Date(act.date).toLocaleString('pt-BR')}
                  </div>
                  {act.timeSpentMinutes ? (
                    <div className="text-primary font-medium mt-1 flex items-center justify-end gap-1">
                      <Clock className="size-3" /> +{act.timeSpentMinutes} min
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {allActivities.length === 0 && (
              <p className="text-muted-foreground py-4 text-center">
                Nenhuma atividade registrada.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
