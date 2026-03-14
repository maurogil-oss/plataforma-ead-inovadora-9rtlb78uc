import { useMemo } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useLmsStore } from '@/stores/lmsStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Video, Activity, Trophy } from 'lucide-react'

export default function EngagementDashboard() {
  const user = useAuthStore((s) => s.user)
  const { courses, enrollments, students, liveClasses } = useLmsStore()

  const data = useMemo(() => {
    if (!user) return null

    // 1. Identify instructor's courses
    const myCourses =
      user.role === 'instructor' ? courses.filter((c) => c.instructorId === user.id) : courses
    const myCourseIds = myCourses.map((c) => c.id)

    // 2. Identify relevant enrollments and students
    const relevantEnrollments = enrollments.filter((e) => myCourseIds.includes(e.courseId))
    const relevantStudentIds = Array.from(new Set(relevantEnrollments.map((e) => e.studentId)))
    const relevantStudents = students.filter((s) => relevantStudentIds.includes(s.id))

    // 3. Active Students (interaction in last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const activeStudentIds = new Set<string>()
    relevantEnrollments.forEach((e) => {
      const hasRecent = e.activityLog.some((a) => new Date(a.date) > sevenDaysAgo)
      if (hasRecent) activeStudentIds.add(e.studentId)
    })
    const activeStudentsCount = activeStudentIds.size

    // 4. Live Attendance Rate
    const myLiveClasses = liveClasses.filter((lc) => myCourseIds.includes(lc.courseId))
    const pastLiveClasses = myLiveClasses.filter((lc) => {
      const start = new Date(`${lc.date}T${lc.startTime}`)
      const end = new Date(start.getTime() + lc.durationMinutes * 60000)
      return new Date() > end
    })

    let totalExpected = 0
    let totalAttended = 0
    pastLiveClasses.forEach((lc) => {
      const enrolledCount = relevantEnrollments.filter((e) => e.courseId === lc.courseId).length
      totalExpected += enrolledCount
      totalAttended += lc.attendees?.length || 0
    })
    const attendanceRate = totalExpected > 0 ? (totalAttended / totalExpected) * 100 : 0

    // 5. Top Lessons
    const lessonCounts: Record<string, number> = {}
    relevantEnrollments.forEach((e) => {
      e.completedLessons.forEach((lId) => {
        lessonCounts[lId] = (lessonCounts[lId] || 0) + 1
      })
    })

    const allLessons = myCourses.flatMap((c) => c.modules.flatMap((m) => m.lessons))
    const topLessons = Object.entries(lessonCounts)
      .map(([id, count]) => {
        const lesson = allLessons.find((l) => l.id === id)
        const course = myCourses.find((c) =>
          c.modules.some((m) => m.lessons.some((l) => l.id === id)),
        )
        return { id, title: lesson?.title || 'Aula Removida', courseTitle: course?.title, count }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // 6. Student Participation Table Data
    const studentParticipation = relevantStudents
      .map((student) => {
        const participationCount = pastLiveClasses.filter((lc) =>
          lc.attendees?.includes(student.id),
        ).length
        const enrolls = relevantEnrollments.filter((e) => e.studentId === student.id).length
        return { ...student, participationCount, enrolls }
      })
      .sort((a, b) => b.participationCount - a.participationCount)

    return {
      activeStudentsCount,
      attendanceRate,
      topLessons,
      studentParticipation,
      pastClassesCount: pastLiveClasses.length,
    }
  }, [user, courses, enrollments, students, liveClasses])

  if (!data) return null

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Engajamento</h1>
        <p className="text-muted-foreground mt-1">
          Monitore a participação dos alunos em aulas ao vivo e conteúdos gravados.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="size-4" /> Alunos Ativos (7 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.activeStudentsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">interagiram com a plataforma</p>
          </CardContent>
        </Card>
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
              <Video className="size-4" /> Taxa de Presença (Ao Vivo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{data.attendanceRate.toFixed(1)}%</div>
            <p className="text-xs text-primary/80 mt-1">
              média em {data.pastClassesCount} aulas passadas
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="size-4" /> Total de Interações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.studentParticipation.reduce((acc, s) => acc + s.participationCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">presenças registradas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-amber-500" /> Aulas Mais Engajadas
            </CardTitle>
            <CardDescription>Conteúdos com maior número de conclusões.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topLessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium leading-none">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{lesson.courseTitle}</p>
                  </div>
                  <div className="text-sm font-bold bg-primary/10 text-primary px-2 py-1 rounded">
                    {lesson.count} views
                  </div>
                </div>
              ))}
              {data.topLessons.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Dados insuficientes.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participação por Aluno</CardTitle>
            <CardDescription>Frequência específica nas sessões ao vivo.</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="text-center">Matrículas</TableHead>
                  <TableHead className="text-right">Aulas Assistidas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.studentParticipation.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-xs text-muted-foreground">{student.email}</div>
                    </TableCell>
                    <TableCell className="text-center">{student.enrolls}</TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {student.participationCount}
                    </TableCell>
                  </TableRow>
                ))}
                {data.studentParticipation.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                      Nenhum aluno encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
