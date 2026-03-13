import { create } from 'zustand'

export type LessonType = 'video' | 'text' | 'exam' | 'pdf' | 'excel' | 'audio' | 'image' | 'file'
export type QuestionType = 'single' | 'multiple' | 'essay'

export interface BankQuestion {
  id: string
  text: string
  type: QuestionType
  options?: string[]
  correctOptionIndex?: number
  correctOptions?: number[]
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface ExamConfig {
  mode: 'manual' | 'random'
  manualQuestionIds?: string[]
  randomCategory?: string
  randomCount?: number
  minGradeRequired?: number
}

export interface Lesson {
  id: string
  title: string
  type: LessonType
  content?: string
  mediaUrl?: string
  downloadable?: boolean
  fileUrl?: string
  examConfig?: ExamConfig
  prerequisiteLessonIds?: string[]
  questions?: any[]
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
  prerequisiteModuleIds?: string[]
}

export interface Batch {
  id: string
  name: string
  startDate: string
  endDate: string
  capacity: number
}

export interface Course {
  id: string
  title: string
  area: string
  description: string
  thumbnail: string
  instructorId?: string
  modules: Module[]
  passingGrade: number
  batches: Batch[]
}

export interface ActivityLog {
  id: string
  date: string
  type: 'enrollment' | 'lesson_complete' | 'exam_attempt' | 'exam_graded' | 'course_completed'
  details: string
  timeSpentMinutes?: number
}

export interface ExamSubmission {
  lessonId: string
  answers: Record<string, any>
  autoScore: number
  isPending: boolean
  maxAutoScore: number
  questions: BankQuestion[]
  essayScore?: number
  feedback?: string
}

export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  batchId?: string
  completedLessons: string[]
  examScores: Record<string, number>
  examSubmissions: Record<string, ExamSubmission>
  activityLog: ActivityLog[]
  isCompleted?: boolean
  completionDate?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'manager' | 'instructor'
  avatar?: string
}

export interface WebhookConfig {
  id: string
  url: string
  events: string[]
}

const MOCK_QUESTIONS: BankQuestion[] = [
  {
    id: 'bq1',
    text: 'Quais são as fases do ciclo de vida de um projeto?',
    type: 'single',
    options: [
      'Iniciação e Encerramento apenas',
      'Iniciação, Planejamento, Execução, Monitoramento, Encerramento',
      'Planejamento e Execução',
    ],
    correctOptionIndex: 1,
    category: 'Projetos',
    difficulty: 'easy',
  },
  {
    id: 'bq2',
    text: 'Selecione as metodologias ágeis válidas:',
    type: 'multiple',
    options: ['Scrum', 'Cascata (Waterfall)', 'Kanban', 'Prince2'],
    correctOptions: [0, 2],
    category: 'Projetos',
    difficulty: 'medium',
  },
]

const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Fundamentos de Gestão de Projetos',
    area: 'Gestão Empresarial',
    description: 'Aprenda os conceitos básicos.',
    thumbnail: 'https://img.usecurling.com/p/800/600?q=business&color=blue',
    instructorId: 'i1',
    passingGrade: 70,
    batches: [],
    modules: [
      {
        id: 'm1',
        title: 'Introdução e Avaliação',
        lessons: [
          {
            id: 'l1',
            title: 'O que é um projeto?',
            type: 'video',
            content: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
            mediaUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          },
          {
            id: 'l2',
            title: 'Material Complementar',
            type: 'pdf',
            mediaUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            downloadable: true,
            prerequisiteLessonIds: ['l1'],
          },
          {
            id: 'l_exam',
            title: 'Avaliação Final',
            type: 'exam',
            prerequisiteLessonIds: ['l2'],
            examConfig: { mode: 'manual', manualQuestionIds: ['bq1', 'bq2'], minGradeRequired: 50 },
          },
        ],
      },
    ],
  },
]

interface LMSStore {
  courses: Course[]
  enrollments: Enrollment[]
  students: User[]
  instructors: User[]
  bankQuestions: BankQuestion[]
  notificationSettings: { emailNewLesson: boolean; emailExamReminder: boolean }
  paymentSettings: { provider: string; apiKey: string }
  webhooks: WebhookConfig[]

  addCourse: (c: Course) => void
  updateCourse: (c: Course) => void
  deleteCourse: (id: string) => void
  enrollStudent: (studentId: string, courseId: string, batchId?: string) => void
  unenrollStudent: (studentId: string, courseId: string) => void
  markLessonComplete: (enrollmentId: string, lessonId: string) => void
  submitExamAnswers: (enrollmentId: string, sub: ExamSubmission) => void
  gradeExam: (enrollmentId: string, lessonId: string, essayScore: number, feedback: string) => void

  addBankQuestion: (q: BankQuestion) => void
  updateBankQuestion: (q: BankQuestion) => void
  deleteBankQuestion: (id: string) => void

  updateNotificationSettings: (s: { emailNewLesson: boolean; emailExamReminder: boolean }) => void
  updatePaymentSettings: (s: { provider: string; apiKey: string }) => void
  addWebhook: (w: WebhookConfig) => void
  deleteWebhook: (id: string) => void
}

const checkCourseCompletion = (enrollment: Enrollment, course: Course): Enrollment => {
  const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id))
  const isCompleted = allLessonIds.every((id) => enrollment.completedLessons.includes(id))
  if (isCompleted && !enrollment.isCompleted) {
    return {
      ...enrollment,
      isCompleted: true,
      completionDate: new Date().toISOString(),
      activityLog: [
        ...enrollment.activityLog,
        {
          id: `act_${Date.now()}`,
          date: new Date().toISOString(),
          type: 'course_completed',
          details: 'Curso concluído com sucesso!',
        },
      ],
    }
  }
  return enrollment
}

export const useLmsStore = create<LMSStore>((set, get) => ({
  courses: MOCK_COURSES,
  students: [{ id: 's1', name: 'João Aluno', email: 'student@empresa.com', role: 'student' }],
  instructors: [
    { id: 'i1', name: 'Prof. Carlos Silva', email: 'instructor@empresa.com', role: 'instructor' },
  ],
  enrollments: [
    {
      id: 'e1',
      studentId: 's1',
      courseId: 'c1',
      completedLessons: ['l1'],
      examScores: {},
      examSubmissions: {},
      activityLog: [],
    },
  ],
  bankQuestions: MOCK_QUESTIONS,
  notificationSettings: { emailNewLesson: true, emailExamReminder: true },
  paymentSettings: { provider: 'Stripe', apiKey: '' },
  webhooks: [],

  addCourse: (course) => set((s) => ({ courses: [...s.courses, course] })),
  updateCourse: (course) =>
    set((s) => ({ courses: s.courses.map((c) => (c.id === course.id ? course : c)) })),
  deleteCourse: (id) => set((s) => ({ courses: s.courses.filter((c) => c.id !== id) })),

  enrollStudent: (studentId, courseId, batchId) =>
    set((s) => {
      if (s.enrollments.some((e) => e.studentId === studentId && e.courseId === courseId)) return s
      // Mock Webhook Trigger
      s.webhooks
        .filter((w) => w.events.includes('enrollment'))
        .forEach((w) =>
          console.log(`[Webhook -> ${w.url}] Event: enrollment`, { studentId, courseId }),
        )

      return {
        enrollments: [
          ...s.enrollments,
          {
            id: `e_${Date.now()}`,
            studentId,
            courseId,
            batchId,
            completedLessons: [],
            examScores: {},
            examSubmissions: {},
            activityLog: [
              {
                id: `act_${Date.now()}`,
                date: new Date().toISOString(),
                type: 'enrollment',
                details: 'Matrícula confirmada',
              },
            ],
          },
        ],
      }
    }),
  unenrollStudent: (studentId, courseId) =>
    set((s) => ({
      enrollments: s.enrollments.filter(
        (e) => !(e.studentId === studentId && e.courseId === courseId),
      ),
    })),

  markLessonComplete: (enrollmentId, lessonId) =>
    set((s) => {
      const enrollments = s.enrollments.map((e) => {
        if (e.id !== enrollmentId || e.completedLessons.includes(lessonId)) return e
        let updatedE = {
          ...e,
          completedLessons: [...e.completedLessons, lessonId],
          activityLog: [
            ...e.activityLog,
            {
              id: `act_${Date.now()}`,
              date: new Date().toISOString(),
              type: 'lesson_complete' as const,
              details: 'Aula concluída',
            },
          ],
        }
        const course = s.courses.find((c) => c.id === e.courseId)
        if (course) {
          updatedE = checkCourseCompletion(updatedE, course)
          if (updatedE.isCompleted && !e.isCompleted) {
            // Mock Webhook Trigger
            s.webhooks
              .filter((w) => w.events.includes('course_completed'))
              .forEach((w) =>
                console.log(`[Webhook -> ${w.url}] Event: course_completed`, {
                  studentId: e.studentId,
                  courseId: e.courseId,
                }),
              )
          }
        }
        return updatedE
      })
      return { enrollments }
    }),

  submitExamAnswers: (enrollmentId, sub) =>
    set((s) => ({
      enrollments: s.enrollments.map((e) => {
        if (e.id !== enrollmentId) return e
        let updatedE = {
          ...e,
          examSubmissions: { ...e.examSubmissions, [sub.lessonId]: sub },
          activityLog: [
            ...e.activityLog,
            {
              id: `act_${Date.now()}`,
              date: new Date().toISOString(),
              type: 'exam_attempt' as const,
              details: sub.isPending ? 'Prova enviada para correção' : 'Prova concluída',
            },
          ],
        }
        if (!sub.isPending) {
          updatedE.examScores = { ...e.examScores, [sub.lessonId]: sub.autoScore }
        }
        return updatedE
      }),
    })),

  gradeExam: (enrollmentId, lessonId, essayScore, feedback) =>
    set((s) => ({
      enrollments: s.enrollments.map((e) => {
        if (e.id !== enrollmentId) return e
        const sub = e.examSubmissions[lessonId]
        if (!sub) return e
        const finalScore = sub.autoScore + essayScore
        let updatedE = {
          ...e,
          examScores: { ...e.examScores, [lessonId]: finalScore },
          examSubmissions: {
            ...e.examSubmissions,
            [lessonId]: { ...sub, isPending: false, essayScore, feedback },
          },
          completedLessons: [...new Set([...e.completedLessons, lessonId])],
          activityLog: [
            ...e.activityLog,
            {
              id: `act_${Date.now()}`,
              date: new Date().toISOString(),
              type: 'exam_graded' as const,
              details: `Prova corrigida manualmente. Nota: ${finalScore}`,
            },
          ],
        }
        const course = s.courses.find((c) => c.id === e.courseId)
        if (course) {
          updatedE = checkCourseCompletion(updatedE, course)
          if (updatedE.isCompleted && !e.isCompleted) {
            s.webhooks
              .filter((w) => w.events.includes('course_completed'))
              .forEach((w) => console.log(`[Webhook -> ${w.url}] Event: course_completed`))
          }
        }
        return updatedE
      }),
    })),

  addBankQuestion: (q) => set((s) => ({ bankQuestions: [...s.bankQuestions, q] })),
  updateBankQuestion: (q) =>
    set((s) => ({ bankQuestions: s.bankQuestions.map((b) => (b.id === q.id ? q : b)) })),
  deleteBankQuestion: (id) =>
    set((s) => ({ bankQuestions: s.bankQuestions.filter((b) => b.id !== id) })),

  updateNotificationSettings: (s) => set({ notificationSettings: s }),
  updatePaymentSettings: (s) => set({ paymentSettings: s }),
  addWebhook: (w) => set((s) => ({ webhooks: [...s.webhooks, w] })),
  deleteWebhook: (id) => set((s) => ({ webhooks: s.webhooks.filter((w) => w.id !== id) })),
}))
