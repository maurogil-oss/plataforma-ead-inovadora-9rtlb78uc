import { create } from 'zustand'

export type LessonType = 'video' | 'text' | 'exam' | 'file'
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
}

export interface Lesson {
  id: string
  title: string
  type: LessonType
  content?: string
  fileUrl?: string
  examConfig?: ExamConfig
  questions?: any[] // legacy
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
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
  type: 'enrollment' | 'lesson_complete' | 'exam_attempt' | 'exam_graded'
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
}

export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'manager' | 'instructor'
  avatar?: string
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
  {
    id: 'bq3',
    text: 'Descreva em suas palavras a importância do gerenciamento de riscos.',
    type: 'essay',
    category: 'Projetos',
    difficulty: 'hard',
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
            content: 'https://img.usecurling.com/p/1280/720?q=presentation',
          },
          {
            id: 'l_exam',
            title: 'Avaliação Final',
            type: 'exam',
            examConfig: { mode: 'manual', manualQuestionIds: ['bq1', 'bq2', 'bq3'] },
          },
        ],
      },
    ],
  },
]

interface NotificationSettings {
  emailNewLesson: boolean
  emailExamReminder: boolean
}

interface LMSStore {
  courses: Course[]
  enrollments: Enrollment[]
  students: User[]
  instructors: User[]
  bankQuestions: BankQuestion[]
  notificationSettings: NotificationSettings
  paymentSettings: { provider: string; apiKey: string }

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

  updateNotificationSettings: (s: NotificationSettings) => void
  updatePaymentSettings: (s: { provider: string; apiKey: string }) => void
}

export const useLmsStore = create<LMSStore>((set) => ({
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

  addCourse: (course) => set((s) => ({ courses: [...s.courses, course] })),
  updateCourse: (course) =>
    set((s) => ({ courses: s.courses.map((c) => (c.id === course.id ? course : c)) })),
  deleteCourse: (id) => set((s) => ({ courses: s.courses.filter((c) => c.id !== id) })),

  enrollStudent: (studentId, courseId, batchId) =>
    set((s) => {
      if (s.enrollments.some((e) => e.studentId === studentId && e.courseId === courseId)) return s
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
    set((s) => ({
      enrollments: s.enrollments.map((e) =>
        e.id === enrollmentId && !e.completedLessons.includes(lessonId)
          ? {
              ...e,
              completedLessons: [...e.completedLessons, lessonId],
              activityLog: [
                ...e.activityLog,
                {
                  id: `act_${Date.now()}`,
                  date: new Date().toISOString(),
                  type: 'lesson_complete',
                  details: 'Aula concluída',
                },
              ],
            }
          : e,
      ),
    })),

  submitExamAnswers: (enrollmentId, sub) =>
    set((s) => ({
      enrollments: s.enrollments.map((e) => {
        if (e.id !== enrollmentId) return e
        const updatedE = {
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
        if (!sub.isPending) updatedE.examScores = { ...e.examScores, [sub.lessonId]: sub.autoScore }
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
        return {
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
              type: 'exam_graded',
              details: `Prova corrigida manualmente. Nota: ${finalScore}`,
            },
          ],
        }
      }),
    })),

  addBankQuestion: (q) => set((s) => ({ bankQuestions: [...s.bankQuestions, q] })),
  updateBankQuestion: (q) =>
    set((s) => ({ bankQuestions: s.bankQuestions.map((b) => (b.id === q.id ? q : b)) })),
  deleteBankQuestion: (id) =>
    set((s) => ({ bankQuestions: s.bankQuestions.filter((b) => b.id !== id) })),

  updateNotificationSettings: (s) => set({ notificationSettings: s }),
  updatePaymentSettings: (s) => set({ paymentSettings: s }),
}))
