import { useLmsStore, Enrollment } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { PlayCircle, Award, CheckCircle2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function MyEnrollments() {
  const user = useAuthStore((s) => s.user)
  const { courses, enrollments } = useLmsStore()

  if (!user) return null

  const myEnrollments = enrollments.filter((e) => e.studentId === user.id)
  const inProgress = myEnrollments.filter((e) => !e.isCompleted)
  const completed = myEnrollments.filter((e) => e.isCompleted)

  const renderCourse = (e: Enrollment) => {
    const course = courses.find((c) => c.id === e.courseId)
    if (!course) return null
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
    const progress =
      totalLessons > 0 ? Math.round((e.completedLessons.length / totalLessons) * 100) : 0

    return (
      <Card
        key={e.id}
        className="overflow-hidden flex flex-col md:flex-row gap-6 p-5 hover:shadow-lg transition-all border-border/50"
      >
        <div className="w-full md:w-72 h-44 shrink-0 relative rounded-xl overflow-hidden bg-muted group">
          <img
            src={course.thumbnail}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt=""
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle className="size-16 text-white drop-shadow-lg scale-90 group-hover:scale-100 transition-transform" />
          </div>
          {e.isCompleted && (
            <div className="absolute top-3 left-3 bg-success text-white font-bold px-3 py-1 rounded shadow-md text-xs flex items-center gap-1.5 uppercase tracking-widest">
              <CheckCircle2 className="size-3.5" /> Concluído
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">
              {course.area}
            </div>
            <h3 className="text-2xl font-extrabold line-clamp-2 mb-2 leading-tight tracking-tight">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
          </div>
          <div className="space-y-3 mt-6">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-foreground">Seu Progresso</span>
              <span className="text-primary">{progress}%</span>
            </div>
            <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-end pt-4 gap-3">
              {e.isCompleted && (
                <Button
                  variant="outline"
                  className="font-bold border-success text-success hover:bg-success hover:text-white"
                  asChild
                >
                  <Link to={`/student/certificate/${course.id}`}>
                    <Award className="mr-2 size-4" /> Ver Certificado
                  </Link>
                </Button>
              )}
              <Button className="font-bold shadow-md" asChild>
                <Link to={`/student/course/${course.id}`}>
                  {e.isCompleted ? 'Revisar Conteúdo' : 'Continuar Aula'}{' '}
                  <PlayCircle className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Minhas Matrículas</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Acompanhe seu progresso e acesse todos os seus certificados.
        </p>
      </div>

      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="mb-8 w-full justify-start border-b rounded-none px-0 h-auto bg-transparent pb-4 gap-6">
          <TabsTrigger
            value="progress"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 rounded-md px-5 py-2.5 font-bold text-base"
          >
            Em Andamento ({inProgress.length})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-success/10 data-[state=active]:text-success border border-transparent data-[state=active]:border-success/20 rounded-md px-5 py-2.5 font-bold text-base"
          >
            Concluídos ({completed.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="progress" className="space-y-6 outline-none">
          {inProgress.length > 0 ? (
            inProgress.map(renderCourse)
          ) : (
            <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-2xl bg-muted/20">
              <PlayCircle className="mx-auto size-12 opacity-30 mb-4" />
              <p className="text-lg font-medium">Nenhum curso em andamento.</p>
              <Button variant="link" asChild className="mt-2 text-primary font-bold">
                <Link to="/store">Explorar novos cursos</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-6 outline-none">
          {completed.length > 0 ? (
            completed.map(renderCourse)
          ) : (
            <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-2xl bg-muted/20">
              <Award className="mx-auto size-12 opacity-30 mb-4" />
              <p className="text-lg font-medium">Nenhum curso concluído ainda.</p>
              <p className="text-sm mt-1">Continue estudando para conquistar seus certificados.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
