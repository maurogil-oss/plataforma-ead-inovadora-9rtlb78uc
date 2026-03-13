import { Link } from 'react-router-dom'
import { useLmsStore } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { PlayCircle, PlusCircle } from 'lucide-react'

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user)
  const { courses, enrollments, enrollStudent } = useLmsStore()

  if (!user) return null

  const myEnrollments = enrollments.filter((e) => e.studentId === user.id)
  const myCourses = myEnrollments
    .map((e) => ({
      course: courses.find((c) => c.id === e.courseId)!,
      enrollment: e,
    }))
    .filter((item) => item.course)

  const availableCourses = courses.filter((c) => !myEnrollments.some((e) => e.courseId === c.id))

  return (
    <div className="space-y-12 pb-10">
      <section>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Meus Cursos</h1>
          <p className="text-muted-foreground mt-1">Continue seu aprendizado de onde parou.</p>
        </div>
        {myCourses.length === 0 ? (
          <div className="p-8 text-center border border-dashed rounded-xl bg-muted/20">
            <p className="text-muted-foreground">Você ainda não possui matrículas ativas.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map(({ course, enrollment }) => {
              const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
              const progress =
                totalLessons > 0
                  ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
                  : 0

              return (
                <Card
                  key={course.id}
                  className="overflow-hidden group hover:shadow-md transition-shadow border-border/50"
                >
                  <div className="h-40 relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground font-medium text-xs px-2.5 py-1 rounded-md">
                      {course.area}
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-bold text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        <span>Progresso do Curso</span>
                        <span className="text-foreground">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                    <Button asChild className="w-full">
                      <Link to={`/student/course/${course.id}`}>
                        <PlayCircle className="mr-2 size-4" /> Continuar Aula
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Catálogo de Cursos</h2>
          <p className="text-muted-foreground mt-1">
            Explore novas áreas de conhecimento e solicite matrícula.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col border-border/50">
              <div className="h-40 relative bg-muted">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">
                  {course.area}
                </div>
                <h3 className="font-bold text-lg mb-2 leading-tight">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                  {course.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary"
                  onClick={() => enrollStudent(user.id, course.id)}
                >
                  <PlusCircle className="mr-2 size-4" /> Realizar Matrícula
                </Button>
              </CardContent>
            </Card>
          ))}
          {availableCourses.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted-foreground border border-dashed rounded-xl">
              Não há novos cursos disponíveis no momento.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
