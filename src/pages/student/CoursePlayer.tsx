import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLmsStore, BankQuestion } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CheckCircle, ArrowLeft, Award, Lock } from 'lucide-react'

export default function CoursePlayer() {
  const { id } = useParams()
  const user = useAuthStore((s) => s.user)
  const { courses, enrollments, markLessonComplete, submitExamAnswers, bankQuestions } =
    useLmsStore()

  const course = courses.find((c) => c.id === id)
  const enrollment = enrollments.find((e) => e.courseId === id && e.studentId === user?.id)

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [currentExamQuestions, setCurrentExamQuestions] = useState<BankQuestion[]>([])

  useEffect(() => {
    if (course && !activeLessonId) setActiveLessonId(course.modules[0]?.lessons[0]?.id || null)
  }, [course, activeLessonId])

  const activeModule = course?.modules.find((m) => m.lessons.some((l) => l.id === activeLessonId))
  const activeLesson = activeModule?.lessons.find((l) => l.id === activeLessonId)
  const submission = activeLesson && enrollment?.examSubmissions?.[activeLesson.id]

  // Setup Exam Questions when lesson changes
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
        // simple random slice for demo
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
      autoScore: maxAuto > 0 ? (autoScore / maxAuto) * 100 : 0, // Normalize to 100 max if no essays
      maxAutoScore: 100,
      isPending: hasEssay,
      questions: currentExamQuestions,
    })
    markLessonComplete(enrollment.id, activeLesson.id)
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
      </div>

      <div className="flex gap-6 flex-1 items-start">
        <div className="w-[320px] flex flex-col border rounded-xl bg-card shrink-0">
          <div className="p-4 border-b font-semibold bg-muted/30">Módulos</div>
          <div className="p-2 space-y-1">
            {course.modules
              .flatMap((m) => m.lessons)
              .map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLessonId(l.id)}
                  className={`w-full text-left p-3 text-sm rounded-md ${activeLessonId === l.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                >
                  {l.title} {enrollment.completedLessons.includes(l.id) && '✓'}
                </button>
              ))}
          </div>
        </div>

        <div className="flex-1 bg-card border rounded-xl p-8">
          {activeLesson ? (
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold">{activeLesson.title}</h2>
              {activeLesson.type === 'video' && (
                <img src={activeLesson.content} className="w-full rounded-lg" />
              )}

              {activeLesson.type === 'exam' && (
                <div className="space-y-8">
                  {submission?.isPending && (
                    <div className="p-4 bg-warning/20 text-warning-foreground rounded-lg font-medium">
                      Prova enviada! Aguardando correção do professor.
                    </div>
                  )}
                  {submission && !submission.isPending && (
                    <div className="p-4 bg-success/20 text-success-foreground rounded-lg font-bold text-xl">
                      Nota Final: {enrollment.examScores[activeLesson.id]?.toFixed(1)}
                    </div>
                  )}
                  {submission?.feedback && (
                    <div className="p-4 bg-muted border rounded-lg">
                      <strong>Feedback:</strong> {submission.feedback}
                    </div>
                  )}

                  {currentExamQuestions.map((q, i) => (
                    <div key={q.id} className="border p-6 rounded-lg bg-muted/5 space-y-4">
                      <p className="font-semibold">
                        {i + 1}. {q.text}
                      </p>

                      {q.type === 'single' && (
                        <RadioGroup
                          disabled={!!submission}
                          value={answers[q.id]?.toString()}
                          onValueChange={(v) => setAnswers({ ...answers, [q.id]: parseInt(v) })}
                        >
                          {q.options?.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center space-x-2">
                              <RadioGroupItem value={oIdx.toString()} id={`${q.id}-${oIdx}`} />
                              <Label htmlFor={`${q.id}-${oIdx}`}>{opt}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {q.type === 'multiple' && (
                        <div className="space-y-2">
                          {q.options?.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center space-x-2">
                              <Checkbox
                                disabled={!!submission}
                                checked={answers[q.id]?.includes(oIdx)}
                                onCheckedChange={(c) => {
                                  let arr = answers[q.id] || []
                                  arr = c ? [...arr, oIdx] : arr.filter((x: any) => x !== oIdx)
                                  setAnswers({ ...answers, [q.id]: arr })
                                }}
                              />
                              <Label>{opt}</Label>
                            </div>
                          ))}
                        </div>
                      )}

                      {q.type === 'essay' && (
                        <Textarea
                          disabled={!!submission}
                          value={answers[q.id] || ''}
                          onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                          placeholder="Sua resposta..."
                          className="h-32"
                        />
                      )}
                    </div>
                  ))}

                  {!submission && (
                    <Button size="lg" className="w-full" onClick={handleSubmitExam}>
                      Enviar Prova
                    </Button>
                  )}
                </div>
              )}

              {activeLesson.type !== 'exam' && (
                <Button
                  size="lg"
                  onClick={handleComplete}
                  disabled={enrollment.completedLessons.includes(activeLesson.id)}
                >
                  {enrollment.completedLessons.includes(activeLesson.id)
                    ? 'Concluída'
                    : 'Marcar Concluída'}
                </Button>
              )}
            </div>
          ) : (
            <p>Selecione uma aula</p>
          )}
        </div>
      </div>
    </div>
  )
}
