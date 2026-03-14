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
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Lock,
  Download,
  FileSpreadsheet,
  FileAudio,
  Video,
  Calendar,
  Clock,
  PlayCircle,
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

  const upcomingLiveClasses = courseLiveClasses.filter((lc) => {
    const start = new Date(`${lc.date}T${lc.startTime}`)
    const end = new Date(start.getTime() + lc.durationMinutes * 60000)
    return new Date() <= end
  })

  const pastLiveClasses = courseLiveClasses
    .filter((lc) => {
      const start = new Date(`${lc.date}T${lc.startTime}`)
      const end = new Date(start.getTime() + lc.durationMinutes * 60000)
      return new Date() > end
    })
    .reverse()

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [currentExamQuestions, setCurrentExamQuestions] = useState<BankQuestion[]>([])

  useEffect(() => {
    if (course && !activeLessonId) {
      let firstUncompleted = null
      if (enrollment) {
        for (const m of course.modules) {
          for (const l of m.lessons) {
            if (!enrollment.completedLessons.includes(l.id)) {
              firstUncompleted = l.id
              break
            }
          }
          if (firstUncompleted) break
        }
      }
      setActiveLessonId(firstUncompleted || course.modules[0]?.lessons[0]?.id || null)
    }
  }, [course, activeLessonId, enrollment])

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
          <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center relative shadow-inner">
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
          <div className="p-8 bg-muted/30 rounded-lg flex flex-col items-center justify-center space-y-4 border shadow-sm">
            <FileAudio className="size-16 text-primary opacity-50" />
            <audio src={lesson.mediaUrl} controls className="w-full max-w-md" />
          </div>
        )
      case 'image':
        return (
          <img
            src={lesson.mediaUrl}
            alt={lesson.title}
            className="w-full rounded-lg max-h-[70vh] object-contain bg-muted shadow-sm"
          />
        )
      case 'pdf':
        return (
          <iframe
            src={lesson.mediaUrl}
            className="w-full h-[70vh] rounded-lg border bg-white shadow-sm"
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
            className="prose dark:prose-invert max-w-none p-6 md:p-8 bg-card border rounded-lg shadow-sm"
            dangerouslySetInnerHTML={{ __html: lesson.content || '<p>Vazio</p>' }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="shrink-0">
            <Link to="/student/dashboard">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold line-clamp-1">{course.title}</h1>
        </div>
        {enrollment.isCompleted && (
          <Button
            asChild
            className="bg-success hover:bg-success/90 text-success-foreground shrink-0 w-full sm:w-auto"
          >
            <Link to={`/student/certificate/${course.id}`}>Visualizar Certificado</Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none px-0 h-auto bg-transparent pb-4 mb-6 gap-6">
          <TabsTrigger
            value="content"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 rounded-md px-4 py-2 font-semibold"
          >
            Conteúdo do Curso
          </TabsTrigger>
          <TabsTrigger
            value="live"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 rounded-md px-4 py-2 font-semibold relative"
          >
            <Video className="mr-2 size-4" /> Aulas ao Vivo e Gravações
            {upcomingLiveClasses.some((lc) => {
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
          <div className="w-full lg:w-[340px] flex flex-col border rounded-xl bg-card shrink-0 shadow-sm overflow-hidden">
            {course.modules.map((m) => (
              <div key={m.id} className="border-b last:border-0">
                <div className="p-3.5 bg-muted/40 font-bold text-sm flex items-center justify-between">
                  <span>{m.title}</span>
                  {isModuleCompleted(m.id) && (
                    <span className="text-success text-xs bg-success/10 px-2 py-0.5 rounded">
                      Concluído
                    </span>
                  )}
                </div>
                <div className="p-1.5 space-y-0.5">
                  {m.lessons.map((l) => {
                    const lLock = checkLockStatus(l, m)
                    const isDone = enrollment.completedLessons.includes(l.id)
                    return (
                      <button
                        key={l.id}
                        onClick={() => setActiveLessonId(l.id)}
                        className={`w-full text-left p-2.5 px-3 text-sm rounded-md flex items-center gap-3 transition-colors ${activeLessonId === l.id ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'hover:bg-muted/60 font-medium'} ${lLock.locked ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <span className="flex-shrink-0">
                          {lLock.locked ? (
                            <Lock className="size-4 opacity-70" />
                          ) : isDone ? (
                            <span className="text-success font-extrabold text-lg leading-none">
                              ✓
                            </span>
                          ) : (
                            <span className="w-4 h-4 rounded-full border-[2.5px] border-current opacity-30 inline-block" />
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
              <div className="flex-1 flex items-center justify-center flex-col text-center space-y-4 py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-2">
                  <Lock className="size-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Conteúdo Bloqueado</h2>
                <p className="text-muted-foreground max-w-md mx-auto">{currentLock.reason}</p>
              </div>
            ) : activeLesson ? (
              <div className="w-full mx-auto space-y-8 flex-1 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <h2 className="text-3xl font-extrabold tracking-tight">{activeLesson.title}</h2>
                  {activeLesson.downloadable &&
                    activeLesson.mediaUrl &&
                    activeLesson.type !== 'excel' && (
                      <Button variant="outline" asChild size="sm" className="shrink-0 font-bold">
                        <a href={activeLesson.mediaUrl} target="_blank" rel="noreferrer" download>
                          <Download className="mr-2 size-4" /> Material
                        </a>
                      </Button>
                    )}
                </div>
                <div className="flex-1 w-full relative">{renderMedia(activeLesson)}</div>

                {activeLesson.type === 'exam' && (
                  <div className="space-y-8 bg-muted/5 p-6 md:p-8 rounded-xl border shadow-sm">
                    {submission?.isPending && (
                      <div className="p-4 bg-warning/20 text-warning-foreground border border-warning/30 rounded-lg font-bold">
                        Aguardando correção do professor.
                      </div>
                    )}
                    {submission && !submission.isPending && (
                      <div className="p-5 bg-success/10 border border-success/30 rounded-lg flex justify-between items-center shadow-sm">
                        <div>
                          <p className="text-sm font-bold text-success-foreground mb-1 uppercase tracking-wider">
                            Nota Final
                          </p>
                          <p className="text-4xl font-extrabold text-success">
                            {enrollment.examScores[activeLesson.id]?.toFixed(1)}{' '}
                            <span className="text-xl text-success-foreground/60">/ 100</span>
                          </p>
                        </div>
                        {activeLesson.examConfig?.minGradeRequired && (
                          <div className="text-right">
                            <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                              Nota Mínima
                            </p>
                            <p className="font-extrabold text-lg text-foreground">
                              {activeLesson.examConfig.minGradeRequired}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {currentExamQuestions.map((q, i) => (
                      <div key={q.id} className="border p-6 rounded-xl bg-card shadow-sm space-y-5">
                        <p className="font-bold text-lg leading-relaxed">
                          {i + 1}. {q.text}
                        </p>
                        {q.type === 'single' && (
                          <RadioGroup
                            disabled={!!submission}
                            value={answers[q.id]?.toString()}
                            onValueChange={(v) => setAnswers({ ...answers, [q.id]: parseInt(v) })}
                            className="space-y-2"
                          >
                            {q.options?.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition-colors"
                              >
                                <RadioGroupItem value={oIdx.toString()} id={`${q.id}-${oIdx}`} />
                                <Label
                                  htmlFor={`${q.id}-${oIdx}`}
                                  className="text-base font-medium flex-1 cursor-pointer leading-snug"
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
                                className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition-colors"
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
                                <Label className="text-base font-medium flex-1 cursor-pointer leading-snug">
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
                            placeholder="Escreva sua resposta detalhada..."
                            className="h-40 text-base resize-y"
                          />
                        )}
                      </div>
                    ))}
                    {!submission && (
                      <Button
                        size="lg"
                        className="w-full text-lg h-14 font-bold shadow-md"
                        onClick={handleSubmitExam}
                      >
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
                      className={
                        enrollment.completedLessons.includes(activeLesson.id)
                          ? 'font-bold'
                          : 'font-bold shadow-md'
                      }
                    >
                      {enrollment.completedLessons.includes(activeLesson.id)
                        ? 'Aula Concluída'
                        : 'Marcar como Concluída'}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground font-medium">
                Selecione uma aula no menu lateral
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="live" className="outline-none mt-0 space-y-8">
          <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 tracking-tight">Próximas Aulas ao Vivo</h2>
            {upcomingLiveClasses.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
                <Video className="mx-auto size-12 opacity-20 mb-4" />
                <p className="font-medium text-lg">
                  Nenhuma aula ao vivo agendada para o futuro neste curso.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {upcomingLiveClasses.map((lc) => {
                  const start = new Date(`${lc.date}T${lc.startTime}`)
                  const end = new Date(start.getTime() + lc.durationMinutes * 60000)
                  const now = new Date()
                  const isLive = now >= start && now <= end

                  return (
                    <div
                      key={lc.id}
                      className={`border rounded-xl p-6 flex flex-col transition-all ${isLive ? 'border-red-500 shadow-lg ring-1 ring-red-500/20' : 'bg-background hover:shadow-md'}`}
                    >
                      <div className="flex justify-between items-start mb-5">
                        <div className="space-y-1">
                          {isLive ? (
                            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded animate-pulse uppercase tracking-widest shadow-sm">
                              Ao Vivo Agora
                            </span>
                          ) : (
                            <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded uppercase tracking-widest">
                              Agendada
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded uppercase tracking-wider">
                          {lc.platform}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl leading-tight mb-3 text-brand dark:text-white">
                        {lc.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-2 flex-1 font-medium">
                        {lc.description}
                      </p>

                      <div className="space-y-3 mb-8 bg-muted/40 p-4 rounded-lg border border-border/50">
                        <div className="flex items-center text-sm font-semibold">
                          <Calendar className="size-4 mr-3 text-primary" />
                          {start.toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center text-sm font-semibold">
                          <Clock className="size-4 mr-3 text-primary" />
                          {lc.startTime} ({lc.durationMinutes} min)
                        </div>
                      </div>

                      {isLive ? (
                        <Button
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 shadow-md"
                          asChild
                        >
                          <a href={lc.url} target="_blank" rel="noreferrer">
                            <Video className="mr-2 size-5" /> Entrar na Sala
                          </a>
                        </Button>
                      ) : (
                        <Button className="w-full font-bold h-12" variant="outline" disabled>
                          Aguardando Horário
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {pastLiveClasses.length > 0 && (
            <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 tracking-tight">
                Sessões Passadas & Gravações
              </h2>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {pastLiveClasses.map((lc) => {
                  const start = new Date(`${lc.date}T${lc.startTime}`)

                  return (
                    <div
                      key={lc.id}
                      className="border rounded-xl p-6 flex flex-col bg-muted/10 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="secondary" className="font-bold">
                          Finalizada
                        </Badge>
                        <div className="flex items-center text-xs font-bold text-muted-foreground">
                          <Calendar className="size-3.5 mr-1.5" />
                          {start.toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <h3 className="font-bold text-lg leading-tight mb-3 flex-1">{lc.title}</h3>
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-2 font-medium">
                        {lc.description}
                      </p>

                      {lc.recordingUrl ? (
                        <Button
                          className="w-full font-bold shadow-sm h-11 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          asChild
                        >
                          <a href={lc.recordingUrl} target="_blank" rel="noreferrer">
                            <PlayCircle className="mr-2 size-4" /> Assistir Gravação
                          </a>
                        </Button>
                      ) : (
                        <Button
                          className="w-full font-bold h-11 bg-muted text-muted-foreground"
                          variant="secondary"
                          disabled
                        >
                          Gravação Indisponível
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
