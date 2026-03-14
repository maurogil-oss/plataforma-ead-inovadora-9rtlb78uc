import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLmsStore, Course, Enrollment } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { useCommercialStore, Coupon } from '@/stores/commercialStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { PlayCircle, PlusCircle, Tag, Radio, BadgePercent, Info, Clock, Layers } from 'lucide-react'
import { toast } from 'sonner'

const CourseCard = ({
  course,
  onClick,
  actionLabel,
  actionIcon: Icon,
}: {
  course: Course
  onClick: () => void
  actionLabel: string
  actionIcon: any
}) => {
  return (
    <Card
      className="group overflow-hidden border-border/50 bg-card shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] hover:-translate-y-2 relative h-full flex flex-col cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img
          src={course.thumbnail}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt={course.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity z-10" />

        <div className="absolute bottom-3 left-3 right-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <Button
            size="sm"
            className="w-full bg-primary text-primary-foreground font-bold shadow-md"
          >
            <Icon className="mr-2 size-4" /> {actionLabel}
          </Button>
        </div>

        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white font-bold px-2.5 py-1 rounded shadow-sm flex items-center gap-1.5 text-xs border border-white/10 z-20">
          <Tag className="size-3 text-primary" />{' '}
          {course.price > 0 ? `R$ ${course.price.toFixed(2)}` : 'Grátis'}
        </div>
      </div>
      <CardContent className="p-5 flex-1 flex flex-col relative z-10 bg-card">
        <div className="text-[10px] font-bold text-primary mb-1.5 uppercase tracking-widest">
          {course.area}
        </div>
        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors flex-1 line-clamp-2">
          {course.title}
        </h3>
        <div className="mt-4 flex items-center text-sm text-muted-foreground font-medium gap-4">
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" /> {course.modules.length * 2}h
          </span>
          <span className="flex items-center gap-1.5">
            <Layers className="size-4" /> {course.modules.length} Mód.
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

const ContinueWatchingCard = ({
  course,
  enrollment,
  onClick,
}: {
  course: Course
  enrollment: Enrollment
  onClick: () => void
}) => {
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const progress =
    totalLessons > 0 ? Math.round((enrollment.completedLessons.length / totalLessons) * 100) : 0

  return (
    <Card
      className="group overflow-hidden border-border/50 bg-card shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] hover:-translate-y-2 relative h-full flex flex-col cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img
          src={course.thumbnail}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt={course.title}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
          <PlayCircle className="size-16 text-white drop-shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-secondary/80 backdrop-blur-sm z-20">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <CardContent className="p-5 flex-1 flex flex-col relative z-10 bg-card">
        <div className="text-[10px] font-bold text-primary mb-1.5 uppercase tracking-widest">
          {course.area}
        </div>
        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors flex-1 line-clamp-2">
          {course.title}
        </h3>
        <div className="mt-4 flex items-center justify-between text-sm font-medium">
          <span className="text-muted-foreground">Progresso atual</span>
          <span className="text-primary font-bold">{progress}%</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { courses, enrollments, enrollStudent, paymentSettings, liveClasses } = useLmsStore()
  const { coupons, incrementCouponUsage } = useCommercialStore()

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
    if (!couponCode || !enrollCourse) return
    const validCoupon = coupons.find((c) => c.code === couponCode.toUpperCase() && c.isActive)

    if (!validCoupon) return toast.error('Cupom inválido ou inativo.')
    if (validCoupon.maxUses && validCoupon.currentUses >= validCoupon.maxUses)
      return toast.error('O limite de uso deste cupom já foi atingido.')
    if (validCoupon.validCourseIds?.length && !validCoupon.validCourseIds.includes(enrollCourse.id))
      return toast.error('Este cupom não é válido para este curso.')

    setAppliedCoupon(validCoupon)
    toast.success('Cupom aplicado com sucesso!')
  }

  const handleFinalizeEnrollment = () => {
    if (enrollCourse?.batches?.length && !selectedBatch) return toast.error('Selecione uma turma.')
    const affiliateRef = localStorage.getItem('lms_affiliate_ref') || undefined
    enrollStudent(user.id, enrollCourse!.id, selectedBatch || undefined, affiliateRef)

    if (appliedCoupon) incrementCouponUsage(appliedCoupon.id)

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

  const featuredMyCourse = myCourses.length > 0 ? myCourses[0] : null
  const featuredCourse = featuredMyCourse?.course || availableCourses[0] || courses[0]

  const recommendedCourses = availableCourses.slice(0, 5)
  const newCourses = [...availableCourses].reverse().slice(0, 5)
  const availableCoursesByArea = availableCourses.reduce(
    (acc, c) => {
      if (!acc[c.area]) acc[c.area] = []
      acc[c.area].push(c)
      return acc
    },
    {} as Record<string, Course[]>,
  )

  return (
    <div className="space-y-16 pb-24 pt-4 md:pt-6 overflow-x-hidden">
      {activeLiveClasses.length > 0 && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-200 shadow-md mx-4 md:mx-8 w-auto">
          <Radio className="size-5 text-red-600 dark:text-red-400 animate-pulse" />
          <AlertTitle className="font-bold text-lg text-red-700 dark:text-red-300">
            Atenção! Aula ao vivo acontecendo agora.
          </AlertTitle>
          <AlertDescription className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span>
              Você tem {activeLiveClasses.length} aula(s) rolando neste momento. Não perca o
              conteúdo!
            </span>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white shrink-0 shadow-sm"
              onClick={() => navigate(`/student/course/${activeLiveClasses[0].courseId}`)}
            >
              Acessar Transmissão
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {featuredCourse && (
        <section className="relative w-full rounded-[2rem] overflow-hidden min-h-[500px] lg:min-h-[600px] flex flex-col justify-end p-8 md:p-12 shadow-2xl group border border-border/50 mx-4 md:mx-8 max-w-[calc(100%-2rem)] md:max-w-[calc(100%-4rem)]">
          <div className="absolute inset-0">
            <img
              src={featuredCourse.thumbnail}
              alt={featuredCourse.title}
              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent" />
          </div>
          <div className="relative z-10 max-w-3xl space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-xs px-3 py-1 border-none">
                Destaque
              </Badge>
              <span className="text-slate-300 font-semibold text-sm uppercase tracking-wider">
                {featuredCourse.area}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              {featuredCourse.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-medium line-clamp-2 max-w-2xl drop-shadow-sm">
              {featuredCourse.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {featuredMyCourse ? (
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-bold shadow-xl"
                  onClick={() => navigate(`/student/course/${featuredCourse.id}`)}
                >
                  <PlayCircle className="mr-2 size-5" /> Continuar Assistindo
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-bold shadow-xl"
                  onClick={() => handleEnrollClick(featuredCourse)}
                >
                  <PlusCircle className="mr-2 size-5" /> Inscrever-se Agora
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-bold bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-sm"
                onClick={() => {
                  if (featuredMyCourse) navigate(`/student/course/${featuredCourse.id}`)
                  else handleEnrollClick(featuredCourse)
                }}
              >
                <Info className="mr-2 size-5" />{' '}
                {featuredMyCourse ? 'Ver Aulas' : 'Mais Informações'}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Increased py-10 padding on all carousels to prevent overlap when cards scale up */}
      {myCourses.length > 0 && (
        <section className="space-y-6 px-4 md:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight px-1">Continuar Assistindo</h2>
          <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
            <CarouselContent className="-ml-4 py-10 px-1">
              {myCourses.map(({ course, enrollment }) => (
                <CarouselItem
                  key={course.id}
                  className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 relative z-10"
                >
                  <ContinueWatchingCard
                    course={course}
                    enrollment={enrollment}
                    onClick={() => navigate(`/student/course/${course.id}`)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden lg:block">
              <CarouselPrevious className="-left-4 h-14 w-14 border-2 bg-background/95 backdrop-blur shadow-xl hover:bg-background z-30" />
              <CarouselNext className="-right-4 h-14 w-14 border-2 bg-background/95 backdrop-blur shadow-xl hover:bg-background z-30" />
            </div>
          </Carousel>
        </section>
      )}

      {recommendedCourses.length > 0 && (
        <section className="space-y-6 px-4 md:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight px-1">Recomendados para Você</h2>
          <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
            <CarouselContent className="-ml-4 py-10 px-1">
              {recommendedCourses.map((course) => (
                <CarouselItem
                  key={course.id}
                  className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 relative z-10"
                >
                  <CourseCard
                    course={course}
                    onClick={() => handleEnrollClick(course)}
                    actionLabel="Ver Detalhes"
                    actionIcon={Info}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden lg:block">
              <CarouselPrevious className="-left-4 h-14 w-14 border-2 bg-background/95 backdrop-blur shadow-xl hover:bg-background z-30" />
              <CarouselNext className="-right-4 h-14 w-14 border-2 bg-background/95 backdrop-blur shadow-xl hover:bg-background z-30" />
            </div>
          </Carousel>
        </section>
      )}

      {newCourses.length > 0 && (
        <section className="space-y-6 px-4 md:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight px-1">Novos Cursos</h2>
          <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
            <CarouselContent className="-ml-4 py-10 px-1">
              {newCourses.map((course) => (
                <CarouselItem
                  key={course.id}
                  className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 relative z-10"
                >
                  <CourseCard
                    course={course}
                    onClick={() => handleEnrollClick(course)}
                    actionLabel="Adicionar à Lista"
                    actionIcon={PlusCircle}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden lg:block">
              <CarouselPrevious className="-left-4 h-14 w-14 border-2 bg-background/95 backdrop-blur shadow-xl hover:bg-background z-30" />
              <CarouselNext className="-right-4 h-14 w-14 border-2 bg-background/95 backdrop-blur shadow-xl hover:bg-background z-30" />
            </div>
          </Carousel>
        </section>
      )}

      {Object.entries(availableCoursesByArea).map(([area, areaCourses]) => (
        <section key={area} className="space-y-6 px-4 md:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight px-1">Trilha: {area}</h2>
          <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
            <CarouselContent className="-ml-4 py-10 px-1">
              {areaCourses.map((course) => (
                <CarouselItem
                  key={course.id}
                  className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 relative z-10"
                >
                  <CourseCard
                    course={course}
                    onClick={() => handleEnrollClick(course)}
                    actionLabel="Ver Detalhes"
                    actionIcon={Info}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden lg:block">
              <CarouselPrevious className="-left-4 h-14 w-14 border-2 bg-background/95 backdrop-blur shadow-xl hover:bg-background z-30" />
              <CarouselNext className="-right-4 h-14 w-14 border-2 bg-background/95 backdrop-blur shadow-xl hover:bg-background z-30" />
            </div>
          </Carousel>
        </section>
      ))}

      <Dialog open={!!enrollCourse} onOpenChange={(o) => !o && setEnrollCourse(null)}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
          <div className="h-32 bg-muted relative">
            {enrollCourse?.thumbnail && (
              <img
                src={enrollCourse.thumbnail}
                className="w-full h-full object-cover"
                alt="Curso"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          <div className="px-6 pb-6 space-y-5">
            <DialogHeader className="mt-2">
              <DialogTitle className="text-brand text-2xl leading-tight">
                {enrollCourse?.title}
              </DialogTitle>
            </DialogHeader>

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

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground font-medium">
                <span>Valor Base:</span>
                <span>R$ {basePrice.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-success font-bold">
                  <span>Desconto ({appliedCoupon.code}):</span>
                  <span>- R$ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center font-bold pt-2 border-t mt-2">
                <span className="text-brand dark:text-white">Total a Pagar:</span>
                <span className="text-2xl text-primary">R$ {finalPrice.toFixed(2)}</span>
              </div>
            </div>

            {enrollCourse?.batches && enrollCourse.batches.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand dark:text-white">
                  Turma / Ciclo de Ensino
                </label>
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
                <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Radio className="size-4" /> Pagamento Seguro
                </p>
                <Input placeholder="Número do Cartão" />
                <div className="flex gap-2">
                  <Input placeholder="MM/AA" />
                  <Input placeholder="CVC" />
                </div>
              </div>
            )}

            <Button
              className="w-full text-lg h-12 font-bold shadow-md"
              onClick={handleFinalizeEnrollment}
            >
              Confirmar e Pagar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
