import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLmsStore } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  CheckCircle,
  PlayCircle,
  FileText,
  FileQuestion,
  ArrowLeft,
  Award,
  Lock,
  FileDown,
} from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseForum } from '@/components/CourseForum'

export default function CoursePlayer() {
  const { id } = useParams()
  const user = useAuthStore((s) => s.user)
  const { courses, enrollments, markLessonComplete, submitExam } = useLmsStore()
  const course = courses.find((c) => c.id === id)
  const enrollment = enrollments.find((e) => e.courseId === id && e.studentId === user?.id)
  const { setOpen } = useSidebar()
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({})

  useEffect(() => {
    setOpen(false)
    if (course && !activeLessonId) setActiveLessonId(course.modules[0]?.lessons[0]?.id || null)
  }, [course, setOpen, activeLessonId])

  if (!course || !enrollment)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Curso não encontrado ou sem acesso.
      </div>
    )

  const batch = course.batches?.find((b) => b.id === enrollment.batchId)
  let isLockedByBatch = false
  if (batch) {
    const now = new Date()
    if (now < new Date(batch.startDate) || now > new Date(batch.endDate)) isLockedByBatch = true
  }

  const activeModule = course.modules.find((m) => m.lessons.some((l) => l.id === activeLessonId))
  const activeLesson = activeModule?.lessons.find((l) => l.id === activeLessonId)
  const progress =
    course.modules.reduce((acc, m) => acc + m.lessons.length, 0) > 0
      ? Math.round(
          (enrollment.completedLessons.length /
            course.modules.reduce((acc, m) => acc + m.lessons.length, 0)) *
            100,
        )
      : 0

  const exams = course.modules.flatMap((m) => m.lessons.filter((l) => l.type === 'exam'))
  const avgScore =
    exams.length > 0
      ? exams.reduce((acc, e) => acc + (enrollment.examScores[e.id] || 0), 0) / exams.length
      : 100
  const passed = avgScore >= (course.passingGrade || 70)

  const handleComplete = () => activeLesson && markLessonComplete(enrollment.id, activeLesson.id)
  const handleExamSubmit = () => {
    if (!activeLesson?.questions) return
    let score = 0
    activeLesson.questions.forEach((q) => {
      if (examAnswers[q.id] === q.correctOptionIndex) score += 100 / activeLesson.questions!.length
    })
    submitExam(enrollment.id, activeLesson.id, score)
    markLessonComplete(enrollment.id, activeLesson.id)
  }
  const isModuleLocked = (mIdx: number) =>
    mIdx === 0
      ? false
      : !course.modules[mIdx - 1].lessons.every((l) => enrollment.completedLessons.includes(l.id))

  if (isLockedByBatch)
    return (
      <div className="p-12 text-center text-destructive border rounded-xl m-8">
        O acesso ao conteúdo está fora do período válido para a sua turma ({batch?.name}).
      </div>
    )

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="shrink-0">
            <Link to="/student">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight line-clamp-1">{course.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-sm">
            <span className="text-muted-foreground mr-2">Progresso:</span>
            <span className="font-bold text-lg">{progress}%</span>
          </div>
          {progress === 100 && passed && (
            <Button asChild className="bg-success hover:bg-success/90 text-success-foreground">
              <Link to={`/student/certificate/${course.id}`}>
                <Award className="mr-2 size-4" /> Certificado
              </Link>
            </Button>
          )}
          {progress === 100 && !passed && (
            <div className="text-sm text-destructive font-medium bg-destructive/10 px-3 py-1.5 rounded-md">
              Nota mínima: {course.passingGrade}%
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 flex-1 items-start">
        <div className="w-full lg:w-[320px] flex flex-col border rounded-xl bg-card overflow-hidden shrink-0 order-2 lg:order-1 sticky top-4">
          <div className="p-4 border-b bg-muted/30 font-semibold text-sm uppercase">
            Conteúdo Programático
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            <Accordion
              type="multiple"
              defaultValue={course.modules.map((m) => m.id)}
              className="w-full"
            >
              {course.modules.map((mod, mIdx) => {
                const locked = isModuleLocked(mIdx)
                return (
                  <AccordionItem key={mod.id} value={mod.id} className="border-none">
                    <AccordionTrigger
                      className={`hover:no-underline px-3 py-3 text-sm font-semibold ${locked ? 'opacity-60' : ''}`}
                    >
                      Módulo {mIdx + 1}: {mod.title}
                      {locked && <Lock className="size-3.5 ml-2" />}
                    </AccordionTrigger>
                    <AccordionContent className="pb-2">
                      <div className="space-y-1 pl-2 pr-1 mt-1">
                        {mod.lessons.map((lesson) => {
                          const isCompleted = enrollment.completedLessons.includes(lesson.id)
                          const isActive = activeLessonId === lesson.id
                          const Icon =
                            lesson.type === 'video'
                              ? PlayCircle
                              : lesson.type === 'text'
                                ? FileText
                                : lesson.type === 'file'
                                  ? FileDown
                                  : FileQuestion
                          return (
                            <button
                              key={lesson.id}
                              disabled={locked}
                              onClick={() => !locked && setActiveLessonId(lesson.id)}
                              className={`w-full flex items-center gap-3 p-2.5 rounded-md text-left text-sm ${isActive ? 'bg-primary text-primary-foreground font-medium' : locked ? 'opacity-50 text-muted-foreground' : 'hover:bg-muted'}`}
                            >
                              {isCompleted && !isActive ? (
                                <CheckCircle className="size-4 text-success" />
                              ) : (
                                <Icon className="size-4 opacity-80" />
                              )}
                              <span className="flex-1 line-clamp-2">{lesson.title}</span>
                            </button>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        </div>
        <div className="flex-1 flex flex-col w-full bg-card border rounded-xl p-6 order-1 lg:order-2">
          {activeLesson ? (
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="content">Conteúdo da Aula</TabsTrigger>
                <TabsTrigger value="discussion">Dúvidas e Fórum</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="space-y-8 w-full max-w-4xl mx-auto mt-0">
                <h2 className="text-3xl font-semibold leading-tight">{activeLesson.title}</h2>
                {activeLesson.type === 'video' && (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden relative shadow-md">
                    <img
                      src={activeLesson.content}
                      alt="Video Poster"
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-20 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                      >
                        <PlayCircle className="size-12" />
                      </Button>
                    </div>
                  </div>
                )}
                {activeLesson.type === 'text' && (
                  <div className="prose dark:prose-invert max-w-none text-lg text-foreground/90 bg-muted/20 p-8 rounded-lg border">
                    {activeLesson.content}
                  </div>
                )}
                {activeLesson.type === 'file' && (
                  <div className="p-12 bg-muted/20 border border-dashed rounded-lg text-center space-y-4 flex flex-col items-center">
                    <div className="p-4 bg-primary/10 rounded-full text-primary">
                      <FileDown className="size-8" />
                    </div>
                    <h3 className="text-xl font-semibold">Material para Download</h3>
                    <Button asChild>
                      <a href={activeLesson.fileUrl} target="_blank" rel="noreferrer">
                        Baixar Arquivo PDF
                      </a>
                    </Button>
                  </div>
                )}
                {activeLesson.type === 'exam' && activeLesson.questions && (
                  <div className="bg-muted/10 p-6 rounded-xl border">
                    {enrollment.examScores[activeLesson.id] !== undefined ? (
                      <div className="p-8 bg-primary/5 border rounded-lg text-center space-y-3">
                        <h3 className="text-2xl font-bold">Avaliação Concluída</h3>
                        <p className="text-lg text-muted-foreground">
                          Nota:{' '}
                          <span className="font-bold text-3xl text-primary">
                            {enrollment.examScores[activeLesson.id].toFixed(0)}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {activeLesson.questions.map((q, i) => (
                          <div key={q.id} className="space-y-4">
                            <h4 className="font-medium text-lg">
                              {i + 1}. {q.text}
                            </h4>
                            <RadioGroup
                              onValueChange={(v) =>
                                setExamAnswers({ ...examAnswers, [q.id]: parseInt(v) })
                              }
                              className="space-y-2"
                            >
                              {q.options.map((opt, oIdx) => (
                                <div
                                  key={oIdx}
                                  className="flex items-center space-x-3 border bg-card p-4 rounded-lg"
                                >
                                  <RadioGroupItem value={oIdx.toString()} id={`${q.id}-${oIdx}`} />
                                  <Label
                                    htmlFor={`${q.id}-${oIdx}`}
                                    className="flex-1 cursor-pointer"
                                  >
                                    {opt}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        ))}
                        <Button onClick={handleExamSubmit} size="lg" className="w-full">
                          Concluir Prova
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                {activeLesson.type !== 'exam' && (
                  <div className="pt-8 flex justify-end border-t mt-8">
                    <Button
                      size="lg"
                      onClick={handleComplete}
                      disabled={enrollment.completedLessons.includes(activeLesson.id)}
                      variant={
                        enrollment.completedLessons.includes(activeLesson.id)
                          ? 'secondary'
                          : 'default'
                      }
                    >
                      <CheckCircle className="mr-2 size-5" />
                      {enrollment.completedLessons.includes(activeLesson.id)
                        ? 'Aula Finalizada'
                        : 'Marcar como Concluída'}
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="discussion" className="mt-0">
                <CourseForum lessonId={activeLesson.id} courseId={course.id} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-20">
              <p>Selecione uma aula.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
