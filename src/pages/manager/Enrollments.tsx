import { Link } from 'react-router-dom'
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
import { UserPlus, UserMinus } from 'lucide-react'

export default function ManagerEnrollments() {
  const { students, enrollments, courses, enrollStudent, unenrollStudent } = useLmsStore()

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Alunos</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie acessos e visualize o histórico detalhado.
        </p>
      </div>

      <Card className="overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[250px] font-semibold">Identificação do Aluno</TableHead>
                <TableHead className="font-semibold min-w-[300px]">Cursos Matriculados</TableHead>
                <TableHead className="text-right font-semibold">Ações de Acesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const studentEnrollments = enrollments.filter((e) => e.studentId === student.id)
                return (
                  <TableRow key={student.id} className="hover:bg-muted/20">
                    <TableCell>
                      <Link
                        to={`/manager/students/${student.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {student.name}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-0.5">{student.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {studentEnrollments.map((e) => {
                          const course = courses.find((c) => c.id === e.courseId)
                          return (
                            <span
                              key={e.id}
                              className="text-xs font-medium bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-md"
                            >
                              {course?.title || 'Curso Removido'}
                            </span>
                          )
                        })}
                        {studentEnrollments.length === 0 && (
                          <span className="text-muted-foreground text-sm italic">
                            Sem matrículas ativas
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs bg-background"
                          onClick={() => {
                            const unenrolled = courses.find(
                              (c) => !studentEnrollments.some((se) => se.courseId === c.id),
                            )
                            if (unenrolled) enrollStudent(student.id, unenrolled.id)
                          }}
                        >
                          <UserPlus className="mr-1.5 size-3.5" /> Adicionar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs text-destructive hover:bg-destructive/10"
                          disabled={studentEnrollments.length === 0}
                          onClick={() =>
                            unenrollStudent(
                              student.id,
                              studentEnrollments[studentEnrollments.length - 1].courseId,
                            )
                          }
                        >
                          <UserMinus className="mr-1.5 size-3.5" /> Remover
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
