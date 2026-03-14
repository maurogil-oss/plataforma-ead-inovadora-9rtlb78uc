import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLmsStore, Course, Enrollment } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { useCommercialStore, Coupon } from '@/stores/commercialStore'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PlayCircle, PlusCircle, Tag, Radio, BadgePercent } from 'lucide-react'
import { toast } from 'sonner'

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { courses, enrollments, enrollStudent, paymentSettings, liveClasses } = useLmsStore()
  const { coupons } = useCommercialStore()

  const [enrollCourse, setEnrollCourse] = useState<Course | null>(null)
  const [selectedBatch, setSelectedBatch] = useState<string>('')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)

  if (!user) return null

  const myEnrollments = enrollments.filter((e) => e.studentId === user.id)
  const myCourses = myEnrollments
    .map((e) => ({ course: courses.find((c) => c.id === e.courseId), enrollment: e }))
    .filter((item) => item.course) as { course: Course; enrollment: Enrollment }[]

  const availableCourses = courses.filter((c) => !myEnrollments.some((e) => e.courseId === c.id))

  const now = new Date()
  const activeLiveClasses = liveClasses.filter((lc) => {
    if (!myEnrollments.some((e) => e.courseId === lc.courseId)) return false
    const start = new Date(`${lc.date}T${lc.startTime}`)
    const end = new Date(start.getTime() + lc.durationMinutes * 60000)
    return now >= start && now <= end
  })

  const handleEnrollClick = (c: Course) => {
    setCouponCode('')
    setAppliedCoupon(null)
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

  const handleApplyCoupon = () => {
    if (!couponCode) return
    const validCoupon = coupons.find((c) => c.code === couponCode.toUpperCase() && c.isActive)
    if (validCoupon) {
      setAppliedCoupon(validCoupon)
      toast.success('Cupom aplicado com sucesso!')
    } else {
      setAppliedCoupon(null)
      toast.error('Cupom inválido ou inativo.')
    }
  }

  const handleFinalizeEnrollment = () => {
    if (enrollCourse?.batches?.length && !selectedBatch) return toast.error('Selecione uma turma.')
    const affiliateRef = localStorage.getItem('lms_affiliate_ref') || undefined
    enrollStudent(user.id, enrollCourse!.id, selectedBatch || undefined, affiliateRef)
    toast.success('Pagamento Aprovado! Matrícula confirmada.')
    setEnrollCourse(null)
  }

  const basePrice = enrollCourse?.price || 0
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? basePrice * (appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0
  const finalPrice = Math.max(0, basePrice - discountAmount)

  return (
    <div className="space-y-12 pb-10">
      {activeLiveClasses.length > 0 && (
        <Alert className="border-red-500 bg-red-50 text-red-900">
          <Radio className="size-5 text-red-600 animate-pulse" />
          <AlertTitle className="font-bold text-lg text-red-700">
            Atenção! Aula ao vivo acontecendo agora.
          </AlertTitle>
          <AlertDescription className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span>
              Você tem {activeLiveClasses.length} aula(s) rolando neste momento. Não perca o
              conteúdo!
            </span>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white shrink-0"
              onClick={() => navigate(`/student/course/${activeLiveClasses[0].courseId}`)}
            >
              Acessar Transmissão
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <section>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-brand">Meus Cursos</h1>
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
                    <div className="absolute inset-0 bg-brand/20" />
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-bold text-lg line-clamp-2 leading-tight group-hover:text-primary">
                      {course.title}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        <span>Progresso</span>
                        <span className="text-brand">{progress}%</span>
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
          <h2 className="text-2xl font-bold tracking-tight text-brand">Catálogo de Cursos</h2>
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
                <div className="absolute top-3 right-3 bg-brand/90 text-white font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1.5 text-sm">
                  <Tag className="size-3 text-primary" /> R$ {course.price.toFixed(2)}
                </div>
              </div>
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">
                  {course.area}
                </div>
                <h3 className="font-bold text-lg mb-2 leading-tight text-brand">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                  {course.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full text-brand border-brand/20 hover:bg-brand hover:text-white"
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
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-brand">Finalizar Matrícula</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <h3 className="font-bold text-lg leading-tight">{enrollCourse?.title}</h3>

            <div className="space-y-2 border-b pb-4">
              <label className="text-sm font-semibold flex items-center gap-2">
                <BadgePercent className="size-4 text-primary" /> Cupom de Desconto
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Insira o código promocional"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="uppercase font-mono"
                  disabled={!!appliedCoupon}
                />
                {!appliedCoupon ? (
                  <Button variant="secondary" onClick={handleApplyCoupon}>
                    Aplicar
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setAppliedCoupon(null)
                      setCouponCode('')
                    }}
                  >
                    Remover
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Valor Base:</span>
                <span>R$ {basePrice.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-success font-medium">
                  <span>Desconto ({appliedCoupon.code}):</span>
                  <span>- R$ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center font-bold pt-2 border-t mt-2">
                <span className="text-brand">Total a Pagar:</span>
                <span className="text-2xl text-primary">R$ {finalPrice.toFixed(2)}</span>
              </div>
            </div>

            {enrollCourse?.batches && enrollCourse.batches.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand">Turma / Ciclo de Ensino</label>
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

            {finalPrice > 0 && (
              <div className="bg-muted/30 p-4 rounded-lg border border-dashed space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Dados de Pagamento (Ambiente Seguro)
                </p>
                <Input placeholder="Número do Cartão" />
                <div className="flex gap-2">
                  <Input placeholder="MM/AA" />
                  <Input placeholder="CVC" />
                </div>
              </div>
            )}

            <Button className="w-full text-lg h-12" onClick={handleFinalizeEnrollment}>
              Confirmar e Pagar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
