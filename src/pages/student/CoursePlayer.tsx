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
} from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

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
    if (course && !activeLessonId) {
      setActiveLessonId(course.modules[0]?.lessons[0]?.id || null)
    }
  }, [course, setOpen, activeLessonId])

  if (!course || !enrollment)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Curso não encontrado ou você não possui acesso.
      </div>
    )

  const activeModule = course.modules.find((m) => m.lessons.some((l) => l.id === activeLessonId))
  const activeLesson = activeModule?.lessons.find((l) => l.id === activeLessonId)

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedCount = enrollment.completedLessons.length
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const handleComplete = () => {
    if (activeLesson) markLessonComplete(enrollment.id, activeLesson.id)
  }

  const handleExamSubmit = () => {
    if (!activeLesson?.questions) return
    let score = 0
    activeLesson.questions.forEach((q) => {
      if (examAnswers[q.id] === q.correctOptionIndex) score += 100 / activeLesson.questions!.length
    })
    submitExam(enrollment.id, activeLesson.id, score)
    markLessonComplete(enrollment.id, activeLesson.id)
  }

  const isModuleLocked = (mIdx: number) => {
    if (mIdx === 0) return false
    const prevModule = course.modules[mIdx - 1]
    return !prevModule.lessons.every((l) => enrollment.completedLessons.includes(l.id))
  }

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
            <p className="text-sm text-muted-foreground hidden sm:block">{course.area}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-sm">
            <span className="text-muted-foreground mr-2">Progresso:</span>
            <span className="font-bold text-lg">{progress}%</span>
          </div>
          {progress === 100 && (
            <Button asChild className="bg-success hover:bg-success/90 text-success-foreground">
              <Link to={`/student/certificate/${course.id}`}>
                <Award className="mr-2 size-4" /> Emitir Certificado
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 items-start">
        <div className="w-full lg:w-[320px] flex flex-col border rounded-xl bg-card overflow-hidden shrink-0 order-2 lg:order-1 sticky top-4">
          <div className="p-4 border-b bg-muted/30 font-semibold text-sm uppercase tracking-wider">
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
                      className={`hover:no-underline hover:bg-muted/50 px-3 rounded-md py-3 text-sm font-semibold transition-colors ${locked ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center text-left">
                        <span className="flex-1">
                          Módulo {mIdx + 1}: {mod.title}
                        </span>
                        {locked && <Lock className="size-3.5 ml-2 text-muted-foreground" />}
                      </div>
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
                                : FileQuestion
                          return (
                            <button
                              key={lesson.id}
                              disabled={locked}
                              onClick={() => !locked && setActiveLessonId(lesson.id)}
                              className={`w-full flex items-center gap-3 p-2.5 rounded-md text-left text-sm transition-colors ${
                                isActive
                                  ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                                  : locked
                                    ? 'opacity-50 cursor-not-allowed text-muted-foreground'
                                    : 'hover:bg-muted text-foreground'
                              }`}
                            >
                              {isCompleted && !isActive ? (
                                <CheckCircle className="size-4 text-success shrink-0" />
                              ) : (
                                <Icon className="size-4 shrink-0 opacity-80" />
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

        <div className="flex-1 flex flex-col gap-4 w-full bg-card border rounded-xl p-6 order-1 lg:order-2">
          {activeLesson ? (
            <div className="space-y-8 w-full max-w-4xl mx-auto">
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
                <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-foreground/90 bg-muted/20 p-8 rounded-lg border">
                  {activeLesson.content}
                </div>
              )}

              {activeLesson.type === 'exam' && activeLesson.questions && (
                <div className="space-y-8 bg-muted/10 p-6 sm:p-8 rounded-xl border">
                  {enrollment.examScores[activeLesson.id] !== undefined ? (
                    <div className="p-8 bg-primary/5 border border-primary/20 rounded-lg text-center space-y-3">
                      <h3 className="text-2xl font-bold">Avaliação Concluída</h3>
                      <p className="text-lg text-muted-foreground">
                        Nota atingida:{' '}
                        <span className="font-bold text-3xl text-primary block mt-2">
                          {enrollment.examScores[activeLesson.id].toFixed(0)}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="mb-6 pb-4 border-b">
                        <h3 className="text-xl font-bold">Teste de Verificação</h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                          Responda todas as perguntas para concluir este módulo.
                        </p>
                      </div>
                      {activeLesson.questions.map((q, i) => (
                        <div key={q.id} className="space-y-4">
                          <h4 className="font-medium text-lg leading-snug">
                            {i + 1}. {q.text}
                          </h4>
                          <RadioGroup
                            onValueChange={(val) =>
                              setExamAnswers({ ...examAnswers, [q.id]: parseInt(val) })
                            }
                            className="space-y-2"
                          >
                            {q.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className="flex items-center space-x-3 border bg-card p-4 rounded-lg hover:border-primary/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                              >
                                <RadioGroupItem value={oIdx.toString()} id={`${q.id}-${oIdx}`} />
                                <Label
                                  htmlFor={`${q.id}-${oIdx}`}
                                  className="flex-1 cursor-pointer text-base leading-relaxed"
                                >
                                  {opt}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}
                      <Button
                        onClick={handleExamSubmit}
                        size="lg"
                        className="w-full h-14 text-lg mt-8"
                      >
                        Enviar Respostas e Concluir
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeLesson.type !== 'exam' && (
                <div className="pt-8 flex justify-end border-t mt-8">
                  <Button
                    size="lg"
                    className="px-8"
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
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-20">
              <FileText className="size-16 opacity-20 mb-4" />
              <p className="text-lg">Selecione uma aula no menu lateral para iniciar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
