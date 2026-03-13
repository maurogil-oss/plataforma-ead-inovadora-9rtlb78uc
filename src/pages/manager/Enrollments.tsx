import { Link } from 'react-router-dom'
import { useLmsStore } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function ManagerEnrollments() {
  const user = useAuthStore((s) => s.user)
  const { students, enrollments, courses } = useLmsStore()

  const myCourses =
    user?.role === 'instructor' ? courses.filter((c) => c.instructorId === user.id) : courses
  const myCourseIds = myCourses.map((c) => c.id)

  const relevantEnrollments =
    user?.role === 'instructor'
      ? enrollments.filter((e) => myCourseIds.includes(e.courseId))
      : enrollments

  const studentIds = Array.from(new Set(relevantEnrollments.map((e) => e.studentId)))
  const relevantStudents = students.filter((s) => studentIds.includes(s.id))
  const basePath = user?.role === 'instructor' ? '/instructor' : '/manager'

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alunos Matriculados</h1>
        <p className="text-muted-foreground mt-1">Visualize os alunos dos seus cursos.</p>
      </div>

      <Card className="overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold">Identificação do Aluno</TableHead>
                <TableHead className="font-semibold">Cursos (Seus Cursos)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relevantStudents.map((student) => {
                const sEnrolls = relevantEnrollments.filter((e) => e.studentId === student.id)
                return (
                  <TableRow key={student.id} className="hover:bg-muted/20">
                    <TableCell>
                      <Link
                        to={`${basePath}/students/${student.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {student.name}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-0.5">{student.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {sEnrolls.map((e) => {
                          const c = myCourses.find((x) => x.id === e.courseId)
                          return (
                            <span
                              key={e.id}
                              className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-md"
                            >
                              {c?.title}
                            </span>
                          )
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {relevantStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                    Nenhum aluno encontrado.
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
