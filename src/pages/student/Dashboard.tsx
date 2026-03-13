import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLmsStore, Course } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { PlayCircle, PlusCircle, CalendarDays, Tag } from 'lucide-react'
import { toast } from 'sonner'

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user)
  const { courses, enrollments, enrollStudent, paymentSettings } = useLmsStore()
  const [enrollCourse, setEnrollCourse] = useState<Course | null>(null)
  const [selectedBatch, setSelectedBatch] = useState<string>('')

  if (!user) return null

  const myEnrollments = enrollments.filter((e) => e.studentId === user.id)
  const myCourses = myEnrollments
    .map((e) => ({ course: courses.find((c) => c.id === e.courseId)!, enrollment: e }))
    .filter((item) => item.course)
  const availableCourses = courses.filter((c) => !myEnrollments.some((e) => e.courseId === c.id))

  const activities = myEnrollments.flatMap((e) =>
    e.enrollment.activityLog.map((act) => ({ ...act, courseTitle: e.course.title })),
  )
  activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleEnrollClick = (c: Course) => {
    if (c.batches && c.batches.length > 0) {
      setSelectedBatch('')
      setEnrollCourse(c)
    } else if (paymentSettings.apiKey || c.price > 0) {
      setEnrollCourse(c)
    } else {
      const affiliateRef = localStorage.getItem('lms_affiliate_ref') || undefined
      enrollStudent(user.id, c.id, undefined, affiliateRef)
      toast.success('Matrícula realizada com sucesso.')
    }
  }

  const handleFinalizeEnrollment = () => {
    if (enrollCourse?.batches?.length && !selectedBatch) return toast.error('Selecione uma turma.')
    const affiliateRef = localStorage.getItem('lms_affiliate_ref') || undefined
    enrollStudent(user.id, enrollCourse!.id, selectedBatch || undefined, affiliateRef)
    toast.success('Pagamento Aprovado! Matrícula confirmada.')
    setEnrollCourse(null)
  }

  return (
    <div className="space-y-12 pb-10">
      <section>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Meus Cursos</h1>
          <p className="text-muted-foreground mt-1">Continue seu aprendizado de onde parou.</p>
        </div>
        {myCourses.length === 0 ? (
          <div className="p-8 text-center border border-dashed rounded-xl bg-muted/20 text-muted-foreground">
            Você ainda não possui matrículas ativas.
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
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-bold text-lg line-clamp-2 leading-tight group-hover:text-primary">
                      {course.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        <span>Progresso</span>
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
          <p className="text-muted-foreground mt-1">Explore novas áreas de conhecimento.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col border-border/50">
              <div className="h-40 bg-muted relative">
                <img
                  src={course.thumbnail}
                  className="w-full h-full object-cover opacity-90"
                  alt=""
                />
                <div className="absolute top-3 right-3 bg-background/90 text-foreground font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1.5 text-sm">
                  <Tag className="size-3 text-primary" /> R$ {course.price.toFixed(2)}
                </div>
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
                  className="w-full"
                  onClick={() => handleEnrollClick(course)}
                >
                  <PlusCircle className="mr-2 size-4" /> Comprar Curso
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Dialog open={!!enrollCourse} onOpenChange={(o) => !o && setEnrollCourse(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Matrícula - {enrollCourse?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg font-medium">
              <span>Valor do Curso:</span>
              <span className="text-lg">R$ {enrollCourse?.price.toFixed(2)}</span>
            </div>
            {enrollCourse?.batches && enrollCourse.batches.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Turma / Ciclo de Ensino</label>
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a turma desejada" />
                  </SelectTrigger>
                  <SelectContent>
                    {enrollCourse.batches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name} ({new Date(b.startDate).toLocaleDateString()} a{' '}
                        {new Date(b.endDate).toLocaleDateString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="bg-muted/30 p-4 rounded-lg border space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Simulação de Pagamento ({paymentSettings.provider})
              </p>
              <Input placeholder="Número do Cartão (Fictício)" />
              <div className="flex gap-2">
                <Input placeholder="MM/AA" />
                <Input placeholder="CVC" />
              </div>
            </div>
            <Button className="w-full" onClick={handleFinalizeEnrollment} size="lg">
              Confirmar e Pagar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
