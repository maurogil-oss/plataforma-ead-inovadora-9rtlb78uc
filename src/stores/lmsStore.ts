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
  isNew?: boolean
  popularityScore?: number
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

export interface BiWebhook {
  id: string
  url: string
  events: string[]
  active: boolean
}

export interface ReportSchedule {
  id: string
  type: 'financial' | 'academic' | 'sales'
  frequency: 'daily' | 'weekly' | 'monthly'
  emails: string
  active: boolean
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
  recordingUrl?: string
  attendees?: string[]
}

export interface ThemeSettings {
  carouselArrowColor: string
}

export interface ForumTopic {
  id: string
  forumId: string // 'general' or courseId
  authorId: string
  title: string
  content: string
  createdAt: string
  replies: number
}

export interface ForumReply {
  id: string
  topicId: string
  authorId: string
  content: string
  createdAt: string
}

const MOCK_QUESTIONS: BankQuestion[] = [
  {
    id: 'bq1',
    text: 'Quais são os principais fatores de risco na segurança viária urbana?',
    type: 'single',
    options: ['Clima e Vegetação', 'Velocidade, Álcool e Distração', 'Sinalização e Pedágios'],
    correctOptionIndex: 1,
    category: 'Segurança Viária',
    difficulty: 'easy',
  },
  {
    id: 'bq2',
    text: 'Selecione as tecnologias base de Cidades Inteligentes:',
    type: 'multiple',
    options: ['IoT (Internet das Coisas)', 'Arquitetura Gótica', 'Big Data', 'Máquinas a Vapor'],
    correctOptions: [0, 2],
    category: 'Cidades Inteligentes',
    difficulty: 'medium',
  },
]

const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Fundamentos de Segurança Viária',
    area: 'Segurança Viária',
    description:
      'Promovendo a excelência técnica e a inteligência em mobilidade para a formação de especialistas comprometidos com a educação e a preservação da vida no trânsito.',
    thumbnail: 'https://img.usecurling.com/p/1200/800?q=highway%20traffic%20cone&color=orange',
    price: 197.0,
    instructorId: 'i1',
    passingGrade: 70,
    batches: [],
    isNew: true,
    popularityScore: 85,
    modules: [
      {
        id: 'm1',
        title: 'Introdução e Avaliação',
        lessons: [
          {
            id: 'l1',
            title: 'O que é Visão Zero?',
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
  {
    id: 'c2',
    title: 'Gestão de Mobilidade Urbana',
    area: 'Mobilidade',
    description:
      'Estratégias e technologies para otimizar o fluxo de veículos e pedestres nas grandes cidades.',
    thumbnail: 'https://img.usecurling.com/p/800/600?q=urban%20mobility&color=green',
    price: 297.0,
    instructorId: 'i1',
    passingGrade: 70,
    batches: [],
    isNew: true,
    popularityScore: 98,
    modules: [
      {
        id: 'm2',
        title: 'Primeiros Passos',
        lessons: [
          {
            id: 'l2_1',
            title: 'Modais Ativos vs Motorizados',
            type: 'video',
            mediaUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          },
        ],
      },
    ],
  },
  {
    id: 'c3',
    title: 'Introdução às Cidades Inteligentes',
    area: 'Cidades Inteligentes',
    description:
      'Como a tecnologia, dados e infraestrutura se unem para criar as cidades do futuro.',
    thumbnail: 'https://img.usecurling.com/p/800/600?q=smart%20city&color=cyan',
    price: 397.0,
    instructorId: 'i1',
    passingGrade: 70,
    batches: [],
    popularityScore: 72,
    modules: [
      {
        id: 'm3',
        title: 'Fundamentos',
        lessons: [
          {
            id: 'l3_1',
            title: 'IoT Aplicada ao Tráfego',
            type: 'video',
            mediaUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          },
        ],
      },
    ],
  },
  {
    id: 'c4',
    title: 'Engenharia de Tráfego Avançada',
    area: 'Mobilidade',
    description:
      'Projete vias eficientes e seguras com as metodologias de engenharia mais atuais do mercado.',
    thumbnail: 'https://img.usecurling.com/p/800/600?q=traffic%20engineering&color=orange',
    price: 147.0,
    instructorId: 'i1',
    passingGrade: 70,
    batches: [],
    popularityScore: 95,
    modules: [
      {
        id: 'm4',
        title: 'Sinalização',
        lessons: [
          {
            id: 'l4_1',
            title: 'Semaforização Inteligente',
            type: 'video',
            mediaUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          },
        ],
      },
    ],
  },
  {
    id: 'c5',
    title: 'Sistemas de Transporte Inteligente',
    area: 'Cidades Inteligentes',
    description:
      'Inovações em transporte público e monitoramento de frota para gestão governamental.',
    thumbnail: 'https://img.usecurling.com/p/800/600?q=public%20transport&color=gray',
    price: 197.0,
    instructorId: 'i1',
    passingGrade: 70,
    batches: [],
    popularityScore: 60,
    modules: [
      {
        id: 'm5',
        title: 'Visão Geral',
        lessons: [
          {
            id: 'l5_1',
            title: 'Integração de Dados',
            type: 'video',
            mediaUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          },
        ],
      },
    ],
  },
  {
    id: 'c6',
    title: 'Prevenção de Acidentes e Vidas Salvas',
    area: 'Segurança Viária',
    description:
      'Políticas públicas e conscientização social para zerar estatísticas de mortalidade nas rodovias.',
    thumbnail: 'https://img.usecurling.com/p/800/600?q=accident%20prevention&color=pink',
    price: 247.0,
    instructorId: 'i1',
    passingGrade: 70,
    batches: [],
    isNew: true,
    popularityScore: 88,
    modules: [
      {
        id: 'm6',
        title: 'Campanhas',
        lessons: [
          {
            id: 'l6_1',
            title: 'Educação no Trânsito',
            type: 'video',
            mediaUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
          },
        ],
      },
    ],
  },
]

const getMockLiveClasses = (): LiveClass[] => {
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]

  const liveStartTime = new Date(now.getTime() - 10 * 60000)
  const liveTimeStr = `${liveStartTime.getHours().toString().padStart(2, '0')}:${liveStartTime.getMinutes().toString().padStart(2, '0')}`

  const upcomingStartTime = new Date(now.getTime() + 14 * 60000)
  const upcomingTimeStr = `${upcomingStartTime.getHours().toString().padStart(2, '0')}:${upcomingStartTime.getMinutes().toString().padStart(2, '0')}`

  return [
    {
      id: 'lc_soon',
      courseId: 'c1',
      title: 'Tira Dúvidas - Mobilidade',
      description: 'Entre para tirar suas dúvidas ao vivo.',
      platform: 'meet',
      url: 'https://meet.google.com/test-soon',
      date: upcomingStartTime.toISOString().split('T')[0],
      startTime: upcomingTimeStr,
      durationMinutes: 45,
    },
    {
      id: 'lc1',
      courseId: 'c1',
      title: 'Aula Inaugural - Segurança Viária',
      description: 'Sessão ao vivo para tirar dúvidas iniciais e apresentar o cronograma.',
      platform: 'meet',
      url: 'https://meet.google.com/abc-defg-hij',
      date: todayStr,
      startTime: liveTimeStr,
      durationMinutes: 60,
    },
    {
      id: 'lc_past',
      courseId: 'c1',
      title: 'Gravação: Fundamentos (Semana Passada)',
      description: 'Sessão passada com introdução profunda aos conceitos.',
      platform: 'zoom',
      url: 'https://zoom.us/j/past123',
      date: new Date(now.getTime() - 86400000 * 7).toISOString().split('T')[0],
      startTime: '19:00',
      durationMinutes: 90,
      recordingUrl: 'https://youtube.com/watch?v=mock',
      attendees: ['s1'],
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
  reportSchedules: ReportSchedule[]
  biWebhooks: BiWebhook[]
  commissionSettings: { defaultInstructorRate: number; defaultPartnerRate: number }
  notificationSettings: { emailNewLesson: boolean; emailExamReminder: boolean }
  paymentSettings: { provider: string; apiKey: string }
  webhooks: WebhookConfig[]
  themeSettings: ThemeSettings

  forumTopics: ForumTopic[]
  forumReplies: ForumReply[]

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

  addReportSchedule: (s: ReportSchedule) => void
  updateReportSchedule: (s: ReportSchedule) => void
  deleteReportSchedule: (id: string) => void

  addBiWebhook: (w: BiWebhook) => void
  updateBiWebhook: (w: BiWebhook) => void
  deleteBiWebhook: (id: string) => void

  updateNotificationSettings: (s: { emailNewLesson: boolean; emailExamReminder: boolean }) => void
  updatePaymentSettings: (s: { provider: string; apiKey: string }) => void
  addWebhook: (w: WebhookConfig) => void
  deleteWebhook: (id: string) => void
  updateThemeSettings: (s: ThemeSettings) => void

  addForumTopic: (t: ForumTopic) => void
  addForumReply: (r: ForumReply) => void
}

const checkCourseCompletion = (enrollment: Enrollment, course: Course): Enrollment => {
  const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id))
  const isCompleted =
    allLessonIds.length > 0 && allLessonIds.every((id) => enrollment.completedLessons.includes(id))
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

export const useLmsStore = create<LMSStore>((set) => ({
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
      activityLog: [
        {
          id: 'act_mock1',
          date: new Date().toISOString(),
          type: 'lesson_complete',
          details: 'Aula concluída',
          timeSpentMinutes: 15,
        },
      ],
    },
    {
      id: 'e2',
      studentId: 's1',
      courseId: 'c2',
      completedLessons: ['l2_1'],
      examScores: {},
      examSubmissions: {},
      activityLog: [
        {
          id: 'act_mock2',
          date: new Date().toISOString(),
          type: 'lesson_complete',
          details: 'Aula concluída',
          timeSpentMinutes: 10,
        },
      ],
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
  reportSchedules: [
    {
      id: 'sched_1',
      type: 'financial',
      frequency: 'monthly',
      emails: 'diretoria@onsv.org.br',
      active: true,
    },
  ],
  biWebhooks: [
    {
      id: 'bi_1',
      url: 'https://powerbi.onsv.org.br/webhook/data',
      events: ['new_sale', 'course_completed'],
      active: true,
    },
  ],
  commissionSettings: { defaultInstructorRate: 50, defaultPartnerRate: 20 },
  notificationSettings: { emailNewLesson: true, emailExamReminder: true },
  paymentSettings: { provider: 'Stripe', apiKey: '' },
  webhooks: [],
  themeSettings: { carouselArrowColor: '#ffffff' },

  forumTopics: [
    {
      id: 't1',
      forumId: 'general',
      authorId: 's1',
      title: 'Dúvidas sobre a nova legislação viária',
      content:
        'Alguém poderia me explicar as mudanças referentes à mobilidade urbana e limite de velocidade?',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      replies: 1,
    },
  ],
  forumReplies: [
    {
      id: 'r1',
      topicId: 't1',
      authorId: 'i1',
      content:
        'As principais mudanças envolvem a priorização de modais ativos. Recomendo assistir a aula 2 do curso de Mobilidade.',
      createdAt: new Date().toISOString(),
    },
  ],

  addForumTopic: (t) => set((s) => ({ forumTopics: [...s.forumTopics, t] })),
  addForumReply: (r) =>
    set((s) => {
      const newReplies = [...s.forumReplies, r]
      const newTopics = s.forumTopics.map((t) =>
        t.id === r.topicId ? { ...t, replies: t.replies + 1 } : t,
      )
      return { forumReplies: newReplies, forumTopics: newTopics }
    }),

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

  addReportSchedule: (sched) => set((s) => ({ reportSchedules: [...s.reportSchedules, sched] })),
  updateReportSchedule: (sched) =>
    set((s) => ({
      reportSchedules: s.reportSchedules.map((x) => (x.id === sched.id ? sched : x)),
    })),
  deleteReportSchedule: (id) =>
    set((s) => ({ reportSchedules: s.reportSchedules.filter((x) => x.id !== id) })),

  addBiWebhook: (w) => set((s) => ({ biWebhooks: [...s.biWebhooks, w] })),
  updateBiWebhook: (w) =>
    set((s) => ({ biWebhooks: s.biWebhooks.map((x) => (x.id === w.id ? w : x)) })),
  deleteBiWebhook: (id) => set((s) => ({ biWebhooks: s.biWebhooks.filter((x) => x.id !== id) })),

  updateNotificationSettings: (s) => set({ notificationSettings: s }),
  updatePaymentSettings: (s) => set({ paymentSettings: s }),
  addWebhook: (w) => set((s) => ({ webhooks: [...s.webhooks, w] })),
  deleteWebhook: (id) => set((s) => ({ webhooks: s.webhooks.filter((w) => w.id !== id) })),
  updateThemeSettings: (s) => set({ themeSettings: s }),
}))
