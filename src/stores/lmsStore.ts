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
  price: number
  instructorRateOverride?: number
  partnerRateOverride?: number
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
  isPartner?: boolean
}

export interface WebhookConfig {
  id: string
  url: string
  events: string[]
}

export interface TransactionSplit {
  role: 'platform' | 'instructor' | 'partner'
  userId: string | 'platform'
  amount: number
  percentage: number
}

export interface Transaction {
  id: string
  date: string
  courseId: string
  studentId: string
  amount: number
  affiliateId?: string
  splits: TransactionSplit[]
}

export interface LiveClass {
  id: string
  courseId: string
  title: string
  description: string
  platform: 'meet' | 'zoom' | 'teams'
  url: string
  date: string
  startTime: string
  durationMinutes: number
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
    price: 197.0,
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

const getMockLiveClasses = (): LiveClass[] => {
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]

  // Create a live class that started 10 mins ago and lasts 60 mins
  const liveStartTime = new Date(now.getTime() - 10 * 60000)
  const liveTimeStr = `${liveStartTime.getHours().toString().padStart(2, '0')}:${liveStartTime.getMinutes().toString().padStart(2, '0')}`

  return [
    {
      id: 'lc1',
      courseId: 'c1',
      title: 'Aula Inaugural - Gestão de Projetos',
      description: 'Sessão ao vivo para tirar dúvidas iniciais e apresentar o cronograma.',
      platform: 'meet',
      url: 'https://meet.google.com/abc-defg-hij',
      date: todayStr,
      startTime: liveTimeStr,
      durationMinutes: 60,
    },
    {
      id: 'lc2',
      courseId: 'c1',
      title: 'Mentoria Extra: Metodologias Ágeis',
      description: 'Discussão profunda sobre Scrum e Kanban na prática.',
      platform: 'zoom',
      url: 'https://zoom.us/j/123456789',
      date: new Date(now.getTime() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
      startTime: '19:00',
      durationMinutes: 90,
    },
  ]
}

interface LMSStore {
  courses: Course[]
  enrollments: Enrollment[]
  students: User[]
  instructors: User[]
  bankQuestions: BankQuestion[]
  transactions: Transaction[]
  liveClasses: LiveClass[]
  commissionSettings: { defaultInstructorRate: number; defaultPartnerRate: number }
  notificationSettings: { emailNewLesson: boolean; emailExamReminder: boolean }
  paymentSettings: { provider: string; apiKey: string }
  webhooks: WebhookConfig[]

  addCourse: (c: Course) => void
  updateCourse: (c: Course) => void
  deleteCourse: (id: string) => void
  enrollStudent: (
    studentId: string,
    courseId: string,
    batchId?: string,
    affiliateId?: string,
  ) => void
  unenrollStudent: (studentId: string, courseId: string) => void
  markLessonComplete: (enrollmentId: string, lessonId: string) => void
  submitExamAnswers: (enrollmentId: string, sub: ExamSubmission) => void
  gradeExam: (enrollmentId: string, lessonId: string, essayScore: number, feedback: string) => void

  becomePartner: (userId: string) => void
  updateCommissionSettings: (s: {
    defaultInstructorRate: number
    defaultPartnerRate: number
  }) => void

  addBankQuestion: (q: BankQuestion) => void
  updateBankQuestion: (q: BankQuestion) => void
  deleteBankQuestion: (id: string) => void

  addLiveClass: (lc: LiveClass) => void
  updateLiveClass: (lc: LiveClass) => void
  deleteLiveClass: (id: string) => void

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
    {
      id: 'i1',
      name: 'Prof. Carlos Silva',
      email: 'instructor@empresa.com',
      role: 'instructor',
      isPartner: true,
    },
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
  transactions: [
    {
      id: 'tx1',
      date: new Date().toISOString(),
      courseId: 'c1',
      studentId: 's1',
      amount: 197.0,
      splits: [
        { role: 'instructor', userId: 'i1', amount: 98.5, percentage: 50 },
        { role: 'platform', userId: 'platform', amount: 98.5, percentage: 50 },
      ],
    },
  ],
  liveClasses: getMockLiveClasses(),
  commissionSettings: { defaultInstructorRate: 50, defaultPartnerRate: 20 },
  notificationSettings: { emailNewLesson: true, emailExamReminder: true },
  paymentSettings: { provider: 'Stripe', apiKey: '' },
  webhooks: [],

  addCourse: (course) => set((s) => ({ courses: [...s.courses, course] })),
  updateCourse: (course) =>
    set((s) => ({ courses: s.courses.map((c) => (c.id === course.id ? course : c)) })),
  deleteCourse: (id) => set((s) => ({ courses: s.courses.filter((c) => c.id !== id) })),

  enrollStudent: (studentId, courseId, batchId, affiliateId) =>
    set((s) => {
      if (s.enrollments.some((e) => e.studentId === studentId && e.courseId === courseId)) return s

      const course = s.courses.find((c) => c.id === courseId)
      let newTransactions = s.transactions

      if (course) {
        const amount = course.price || 0
        const instRate = course.instructorRateOverride ?? s.commissionSettings.defaultInstructorRate
        const partRate = course.partnerRateOverride ?? s.commissionSettings.defaultPartnerRate

        const splits: TransactionSplit[] = []
        let platformRate = 100

        if (affiliateId) {
          splits.push({
            role: 'partner',
            userId: affiliateId,
            amount: (amount * partRate) / 100,
            percentage: partRate,
          })
          platformRate -= partRate
        }

        if (course.instructorId) {
          splits.push({
            role: 'instructor',
            userId: course.instructorId,
            amount: (amount * instRate) / 100,
            percentage: instRate,
          })
          platformRate -= instRate
        }

        splits.push({
          role: 'platform',
          userId: 'platform',
          amount: (amount * platformRate) / 100,
          percentage: platformRate,
        })

        newTransactions = [
          ...s.transactions,
          {
            id: `tx_${Date.now()}`,
            date: new Date().toISOString(),
            courseId,
            studentId,
            amount,
            affiliateId,
            splits,
          },
        ]
      }

      s.webhooks
        .filter((w) => w.events.includes('enrollment'))
        .forEach((w) =>
          console.log(`[Webhook -> ${w.url}] Event: enrollment`, { studentId, courseId }),
        )

      return {
        transactions: newTransactions,
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

  becomePartner: (userId) =>
    set((s) => ({
      students: s.students.map((u) => (u.id === userId ? { ...u, isPartner: true } : u)),
      instructors: s.instructors.map((u) => (u.id === userId ? { ...u, isPartner: true } : u)),
    })),

  updateCommissionSettings: (s) => set({ commissionSettings: s }),

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

  addLiveClass: (lc) => set((s) => ({ liveClasses: [...s.liveClasses, lc] })),
  updateLiveClass: (lc) =>
    set((s) => ({ liveClasses: s.liveClasses.map((l) => (l.id === lc.id ? lc : l)) })),
  deleteLiveClass: (id) => set((s) => ({ liveClasses: s.liveClasses.filter((l) => l.id !== id) })),

  updateNotificationSettings: (s) => set({ notificationSettings: s }),
  updatePaymentSettings: (s) => set({ paymentSettings: s }),
  addWebhook: (w) => set((s) => ({ webhooks: [...s.webhooks, w] })),
  deleteWebhook: (id) => set((s) => ({ webhooks: s.webhooks.filter((w) => w.id !== id) })),
}))
