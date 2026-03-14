import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLmsStore, BankQuestion, Lesson, Module } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Lock,
  Download,
  FileSpreadsheet,
  FileAudio,
  Video,
  Calendar,
  Clock,
} from 'lucide-react'

export default function CoursePlayer() {
  const { id } = useParams()
  const user = useAuthStore((s) => s.user)
  const {
    courses,
    enrollments,
    liveClasses,
    markLessonComplete,
    submitExamAnswers,
    bankQuestions,
  } = useLmsStore()

  const course = courses.find((c) => c.id === id)
  const enrollment = enrollments.find((e) => e.courseId === id && e.studentId === user?.id)
  const courseLiveClasses = liveClasses
    .filter((lc) => lc.courseId === id)
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.startTime}`).getTime() -
        new Date(`${b.date}T${b.startTime}`).getTime(),
    )

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [currentExamQuestions, setCurrentExamQuestions] = useState<BankQuestion[]>([])

  useEffect(() => {
    if (course && !activeLessonId) setActiveLessonId(course.modules[0]?.lessons[0]?.id || null)
  }, [course, activeLessonId])

  const activeModule = course?.modules.find((m) => m.lessons.some((l) => l.id === activeLessonId))
  const activeLesson = activeModule?.lessons.find((l) => l.id === activeLessonId)
  const submission = activeLesson && enrollment?.examSubmissions?.[activeLesson.id]

  useEffect(() => {
    if (activeLesson?.type === 'exam' && !submission) {
      setAnswers({})
      if (activeLesson.examConfig?.mode === 'manual') {
        const qs = bankQuestions.filter((b) =>
          activeLesson.examConfig?.manualQuestionIds?.includes(b.id),
        )
        setCurrentExamQuestions(qs)
      } else if (activeLesson.examConfig?.mode === 'random') {
        const qs = bankQuestions.filter(
          (b) => b.category === activeLesson.examConfig?.randomCategory,
        )
        setCurrentExamQuestions(
          qs.sort(() => 0.5 - Math.random()).slice(0, activeLesson.examConfig.randomCount || 5),
        )
      }
    } else if (submission) {
      setCurrentExamQuestions(submission.questions)
      setAnswers(submission.answers)
    }
  }, [activeLessonId, activeLesson, submission, bankQuestions])

  if (!course || !enrollment) return <div className="p-8">Não autorizado.</div>

  const isModuleCompleted = (modId: string) => {
    const mod = course.modules.find((m) => m.id === modId)
    return mod?.lessons.every((l) => enrollment.completedLessons.includes(l.id)) || false
  }

  const checkLockStatus = (lesson: Lesson, module: Module) => {
    if (module.prerequisiteModuleIds) {
      for (const reqModId of module.prerequisiteModuleIds) {
        if (!isModuleCompleted(reqModId)) {
          const reqM = course.modules.find((m) => m.id === reqModId)
          return {
            locked: true,
            reason: `Requer a conclusão do módulo: ${reqM?.title || 'Anterior'}`,
          }
        }
      }
    }
    if (lesson.prerequisiteLessonIds) {
      for (const reqLesId of lesson.prerequisiteLessonIds) {
        if (!enrollment.completedLessons.includes(reqLesId)) {
          const reqL = course.modules.flatMap((m) => m.lessons).find((l) => l.id === reqLesId)
          return {
            locked: true,
            reason: `Requer a conclusão da aula: ${reqL?.title || 'Anterior'}`,
          }
        }
        const reqLes = course.modules.flatMap((m) => m.lessons).find((l) => l.id === reqLesId)
        if (reqLes?.type === 'exam' && reqLes.examConfig?.minGradeRequired) {
          const score = enrollment.examScores[reqLesId]
          if (score === undefined || score < reqLes.examConfig.minGradeRequired) {
            return {
              locked: true,
              reason: `Requer nota mínima de ${reqLes.examConfig.minGradeRequired} na avaliação: ${reqLes.title}`,
            }
          }
        }
      }
    }
    return { locked: false, reason: '' }
  }

  const currentLock =
    activeLesson && activeModule
      ? checkLockStatus(activeLesson, activeModule)
      : { locked: false, reason: '' }
  const handleComplete = () => activeLesson && markLessonComplete(enrollment.id, activeLesson.id)

  const handleSubmitExam = () => {
    if (!activeLesson) return
    let autoScore = 0
    let maxAuto = 0
    let hasEssay = false

    currentExamQuestions.forEach((q) => {
      if (q.type === 'single') {
        maxAuto += 10
        if (answers[q.id] === q.correctOptionIndex) autoScore += 10
      } else if (q.type === 'multiple') {
        maxAuto += 10
        const ans = answers[q.id] || []
        const correct = q.correctOptions || []
        if (ans.length === correct.length && ans.every((a: number) => correct.includes(a)))
          autoScore += 10
      } else if (q.type === 'essay') {
        hasEssay = true
      }
    })

    submitExamAnswers(enrollment.id, {
      lessonId: activeLesson.id,
      answers,
      autoScore: maxAuto > 0 ? (autoScore / maxAuto) * 100 : 0,
      maxAutoScore: 100,
      isPending: hasEssay,
      questions: currentExamQuestions,
    })
    markLessonComplete(enrollment.id, activeLesson.id)
  }

  const renderMedia = (lesson: Lesson) => {
    if (!lesson.mediaUrl && lesson.type !== 'exam')
      return <div className="p-8 bg-muted text-center rounded">Mídia não configurada.</div>
    switch (lesson.type) {
      case 'video':
        return (
          <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center relative">
            <video
              src={lesson.mediaUrl}
              controls
              className="w-full h-full object-contain"
              poster="https://img.usecurling.com/p/1280/720?q=video&color=black"
            />
          </div>
        )
      case 'audio':
        return (
          <div className="p-8 bg-muted/30 rounded-lg flex flex-col items-center justify-center space-y-4 border">
            <FileAudio className="size-16 text-primary opacity-50" />
            <audio src={lesson.mediaUrl} controls className="w-full max-w-md" />
          </div>
        )
      case 'image':
        return (
          <img
            src={lesson.mediaUrl}
            alt={lesson.title}
            className="w-full rounded-lg max-h-[70vh] object-contain bg-muted"
          />
        )
      case 'pdf':
        return (
          <iframe
            src={lesson.mediaUrl}
            className="w-full h-[70vh] rounded-lg border bg-white"
            title={lesson.title}
          />
        )
      case 'excel':
        return (
          <div className="p-12 bg-muted/20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-emerald-100 text-emerald-700 rounded-full">
              <FileSpreadsheet className="size-10" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Planilha de Estudos</h3>
              <p className="text-muted-foreground text-sm mt-1 mb-4">
                Faça o download para o seu dispositivo para visualizar e editar.
              </p>
              {lesson.mediaUrl && (
                <Button asChild>
                  <a href={lesson.mediaUrl} target="_blank" rel="noreferrer" download>
                    <Download className="mr-2 size-4" /> Baixar Planilha
                  </a>
                </Button>
              )}
            </div>
          </div>
        )
      case 'text':
        return (
          <div
            className="prose max-w-none p-6 bg-card border rounded-lg"
            dangerouslySetInnerHTML={{ __html: lesson.content || '<p>Vazio</p>' }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/student">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{course.title}</h1>
        </div>
        {enrollment.isCompleted && (
          <Button asChild className="bg-success hover:bg-success/90 text-success-foreground">
            <Link to={`/student/certificate/${course.id}`}>Visualizar Certificado</Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none px-0 h-auto bg-transparent pb-4 mb-6 gap-6">
          <TabsTrigger
            value="content"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 rounded-md px-4 py-2"
          >
            Conteúdo do Curso
          </TabsTrigger>
          <TabsTrigger
            value="live"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 rounded-md px-4 py-2 relative"
          >
            <Video className="mr-2 size-4" /> Aulas ao Vivo
            {courseLiveClasses.some((lc) => {
              const now = new Date()
              const s = new Date(`${lc.date}T${lc.startTime}`)
              return now >= s && now <= new Date(s.getTime() + lc.durationMinutes * 60000)
            }) && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="content"
          className="flex gap-6 flex-1 items-start flex-col lg:flex-row mt-0 outline-none"
        >
          <div className="w-full lg:w-[320px] flex flex-col border rounded-xl bg-card shrink-0 shadow-sm">
            {course.modules.map((m) => (
              <div key={m.id} className="border-b last:border-0">
                <div className="p-3 bg-muted/40 font-semibold text-sm flex items-center justify-between">
                  <span>{m.title}</span>
                  {isModuleCompleted(m.id) && (
                    <span className="text-success text-xs">✓ Concluído</span>
                  )}
                </div>
                <div className="p-1 space-y-0.5">
                  {m.lessons.map((l) => {
                    const lLock = checkLockStatus(l, m)
                    const isDone = enrollment.completedLessons.includes(l.id)
                    return (
                      <button
                        key={l.id}
                        onClick={() => setActiveLessonId(l.id)}
                        className={`w-full text-left p-2.5 px-3 text-sm rounded-md flex items-center gap-2 transition-colors ${activeLessonId === l.id ? 'bg-primary text-primary-foreground font-medium shadow-sm' : 'hover:bg-muted/50'} ${lLock.locked ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <span className="flex-shrink-0">
                          {lLock.locked ? (
                            <Lock className="size-3.5" />
                          ) : isDone ? (
                            <span className="text-success font-bold text-lg leading-none">✓</span>
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-current opacity-30 inline-block" />
                          )}
                        </span>
                        <span className="truncate flex-1">{l.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 w-full bg-card border rounded-xl p-6 lg:p-10 shadow-sm min-h-[60vh] flex flex-col">
            {activeLesson && currentLock.locked ? (
              <div className="flex-1 flex items-center justify-center flex-col text-center space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <Lock className="size-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Conteúdo Bloqueado</h2>
                <p className="text-muted-foreground">{currentLock.reason}</p>
              </div>
            ) : activeLesson ? (
              <div className="w-full mx-auto space-y-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <h2 className="text-3xl font-bold tracking-tight">{activeLesson.title}</h2>
                  {activeLesson.downloadable &&
                    activeLesson.mediaUrl &&
                    activeLesson.type !== 'excel' && (
                      <Button variant="outline" asChild size="sm">
                        <a href={activeLesson.mediaUrl} target="_blank" rel="noreferrer" download>
                          <Download className="mr-2 size-4" /> Material
                        </a>
                      </Button>
                    )}
                </div>
                <div className="flex-1 w-full relative">{renderMedia(activeLesson)}</div>

                {activeLesson.type === 'exam' && (
                  <div className="space-y-8 bg-muted/5 p-6 rounded-xl border">
                    {submission?.isPending && (
                      <div className="p-4 bg-warning/20 text-warning-foreground rounded-lg font-medium">
                        Aguardando correção.
                      </div>
                    )}
                    {submission && !submission.isPending && (
                      <div className="p-4 bg-success/10 border border-success/30 rounded-lg flex justify-between">
                        <div>
                          <p className="text-sm font-semibold text-success-foreground mb-1">
                            Nota Final
                          </p>
                          <p className="text-3xl font-bold">
                            {enrollment.examScores[activeLesson.id]?.toFixed(1)}{' '}
                            <span className="text-lg text-muted-foreground">/ 100</span>
                          </p>
                        </div>
                        {activeLesson.examConfig?.minGradeRequired && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1">Mínimo</p>
                            <p className="font-semibold">
                              {activeLesson.examConfig.minGradeRequired}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {currentExamQuestions.map((q, i) => (
                      <div key={q.id} className="border p-6 rounded-lg bg-card shadow-sm space-y-4">
                        <p className="font-semibold text-lg">
                          {i + 1}. {q.text}
                        </p>
                        {q.type === 'single' && (
                          <RadioGroup
                            disabled={!!submission}
                            value={answers[q.id]?.toString()}
                            onValueChange={(v) => setAnswers({ ...answers, [q.id]: parseInt(v) })}
                          >
                            {q.options?.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded"
                              >
                                <RadioGroupItem value={oIdx.toString()} id={`${q.id}-${oIdx}`} />
                                <Label
                                  htmlFor={`${q.id}-${oIdx}`}
                                  className="text-base font-normal flex-1 cursor-pointer"
                                >
                                  {opt}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                        {q.type === 'multiple' && (
                          <div className="space-y-2">
                            {q.options?.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded"
                              >
                                <Checkbox
                                  disabled={!!submission}
                                  checked={answers[q.id]?.includes(oIdx)}
                                  onCheckedChange={(c) => {
                                    let arr = answers[q.id] || []
                                    arr = c ? [...arr, oIdx] : arr.filter((x: any) => x !== oIdx)
                                    setAnswers({ ...answers, [q.id]: arr })
                                  }}
                                />
                                <Label className="text-base font-normal flex-1 cursor-pointer">
                                  {opt}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                        {q.type === 'essay' && (
                          <Textarea
                            disabled={!!submission}
                            value={answers[q.id] || ''}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            placeholder="Escreva sua resposta..."
                            className="h-40 text-base"
                          />
                        )}
                      </div>
                    ))}
                    {!submission && (
                      <Button size="lg" className="w-full text-lg" onClick={handleSubmitExam}>
                        Enviar Avaliação
                      </Button>
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
                      {enrollment.completedLessons.includes(activeLesson.id)
                        ? 'Concluída'
                        : 'Marcar como Concluída'}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p>Selecione uma aula</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="live" className="outline-none mt-0">
          <div className="bg-card border rounded-xl p-6 shadow-sm min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-6">Agenda de Aulas ao Vivo</h2>
            {courseLiveClasses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <Video className="mx-auto size-12 opacity-20 mb-4" />
                <p>Nenhuma aula ao vivo agendada para este curso no momento.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courseLiveClasses.map((lc) => {
                  const start = new Date(`${lc.date}T${lc.startTime}`)
                  const end = new Date(start.getTime() + lc.durationMinutes * 60000)
                  const now = new Date()
                  const isLive = now >= start && now <= end
                  const isPast = now > end

                  return (
                    <div
                      key={lc.id}
                      className={`border rounded-xl p-5 flex flex-col transition-all ${isLive ? 'border-red-500 shadow-md ring-1 ring-red-500/20' : 'bg-background hover:shadow-sm'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          {isLive ? (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse uppercase tracking-wide">
                              Ao Vivo Agora
                            </span>
                          ) : isPast ? (
                            <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                              Finalizada
                            </span>
                          ) : (
                            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                              Agendada
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded uppercase">
                          {lc.platform}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg leading-tight mb-2">{lc.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {lc.description}
                      </p>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm font-medium">
                          <Calendar className="size-4 mr-2 text-muted-foreground" />
                          {start.toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center text-sm font-medium">
                          <Clock className="size-4 mr-2 text-muted-foreground" />
                          {lc.startTime} ({lc.durationMinutes} min)
                        </div>
                      </div>

                      {isLive ? (
                        <Button
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                          asChild
                        >
                          <a href={lc.url} target="_blank" rel="noreferrer">
                            <Video className="mr-2 size-4" /> Entrar na Sala
                          </a>
                        </Button>
                      ) : (
                        <Button className="w-full" variant="outline" disabled>
                          {isPast ? 'Sessão Encerrada' : 'Aguardando Horário'}
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
