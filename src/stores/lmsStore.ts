import { create } from 'zustand'

export type LessonType = 'video' | 'text' | 'exam' | 'file'
export interface Question {
  id: string
  text: string
  options: string[]
  correctOptionIndex: number
}
export interface Lesson {
  id: string
  title: string
  type: LessonType
  content?: string
  questions?: Question[]
  fileUrl?: string
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
  modules: Module[]
  passingGrade: number
  batches: Batch[]
}
export interface ActivityLog {
  id: string
  date: string
  type: 'enrollment' | 'lesson_complete' | 'exam_attempt'
  details: string
  timeSpentMinutes?: number
}
export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  batchId?: string
  completedLessons: string[]
  examScores: Record<string, number>
  activityLog: ActivityLog[]
}
export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'manager'
  avatar?: string
}
export interface ForumReply {
  id: string
  userId: string
  text: string
  createdAt: string
}
export interface ForumQuestion {
  id: string
  lessonId: string
  studentId: string
  text: string
  createdAt: string
  resolved: boolean
  replies: ForumReply[]
}

const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Fundamentos de Gestão de Projetos',
    area: 'Gestão Empresarial',
    description: 'Aprenda os conceitos básicos.',
    thumbnail: 'https://img.usecurling.com/p/800/600?q=business%20meeting&color=blue',
    passingGrade: 70,
    batches: [
      {
        id: 'b1',
        name: 'Turma Janeiro',
        startDate: '2020-01-01',
        endDate: '2030-12-31',
        capacity: 100,
      },
    ],
    modules: [
      {
        id: 'm1',
        title: 'Introdução e Ciclo de Vida',
        lessons: [
          {
            id: 'l1',
            title: 'O que é um projeto?',
            type: 'video',
            content: 'https://img.usecurling.com/p/1280/720?q=presentation',
          },
          {
            id: 'l2',
            title: 'Ciclo de Vida do Projeto',
            type: 'text',
            content:
              'O ciclo de vida de um projeto é composto por iniciação, planejamento, execução, monitoramento e encerramento.',
          },
          { id: 'l_file', title: 'Apostila (PDF)', type: 'file', fileUrl: '#' },
        ],
      },
      {
        id: 'm2',
        title: 'Avaliação Final',
        lessons: [
          {
            id: 'l3',
            title: 'Teste de Conhecimentos',
            type: 'exam',
            questions: [
              {
                id: 'q1',
                text: 'Quais são as fases do ciclo de vida?',
                options: [
                  'Iniciação e Encerramento apenas',
                  'Iniciação, Planejamento, Execução, Monitoramento, Encerramento',
                  'Planejamento e Execução',
                  'Análise, Design, Desenvolvimento, Testes',
                ],
                correctOptionIndex: 1,
              },
            ],
          },
        ],
      },
    ],
  },
]

const MOCK_STUDENTS: User[] = [
  {
    id: 's1',
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    role: 'student',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?seed=joao',
  },
]

const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    id: 'e1',
    studentId: 's1',
    courseId: 'c1',
    completedLessons: ['l1'],
    examScores: {},
    activityLog: [
      {
        id: 'a1',
        date: new Date().toISOString(),
        type: 'enrollment',
        details: 'Matrícula inicial',
        timeSpentMinutes: 0,
      },
    ],
  },
]

interface LMSStore {
  courses: Course[]
  enrollments: Enrollment[]
  students: User[]
  forumQuestions: ForumQuestion[]
  paymentSettings: { provider: string; apiKey: string }
  addCourse: (c: Course) => void
  updateCourse: (c: Course) => void
  deleteCourse: (id: string) => void
  enrollStudent: (studentId: string, courseId: string, batchId?: string) => void
  unenrollStudent: (studentId: string, courseId: string) => void
  markLessonComplete: (enrollmentId: string, lessonId: string) => void
  submitExam: (enrollmentId: string, lessonId: string, score: number) => void
  addForumQuestion: (q: ForumQuestion) => void
  addForumReply: (qId: string, r: ForumReply) => void
  resolveForumQuestion: (qId: string) => void
  updatePaymentSettings: (s: { provider: string; apiKey: string }) => void
}

export const useLmsStore = create<LMSStore>((set) => ({
  courses: MOCK_COURSES,
  students: MOCK_STUDENTS,
  enrollments: MOCK_ENROLLMENTS,
  forumQuestions: [
    {
      id: 'fq1',
      lessonId: 'l1',
      studentId: 's1',
      text: 'Posso usar metodologias ágeis?',
      createdAt: new Date().toISOString(),
      resolved: false,
      replies: [],
    },
  ],
  paymentSettings: { provider: 'Stripe', apiKey: '' },
  addCourse: (course) => set((s) => ({ courses: [...s.courses, course] })),
  updateCourse: (course) =>
    set((s) => ({ courses: s.courses.map((c) => (c.id === course.id ? course : c)) })),
  deleteCourse: (id) => set((s) => ({ courses: s.courses.filter((c) => c.id !== id) })),
  enrollStudent: (studentId, courseId, batchId) =>
    set((s) => {
      if (s.enrollments.some((e) => e.studentId === studentId && e.courseId === courseId)) return s
      const act: ActivityLog = {
        id: `act_${Date.now()}`,
        date: new Date().toISOString(),
        type: 'enrollment',
        details: 'Matrícula confirmada',
        timeSpentMinutes: 0,
      }
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
            activityLog: [act],
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
      enrollments: s.enrollments.map((e) => {
        if (e.id === enrollmentId && !e.completedLessons.includes(lessonId)) {
          const act: ActivityLog = {
            id: `act_${Date.now()}`,
            date: new Date().toISOString(),
            type: 'lesson_complete',
            details: 'Aula concluída',
            timeSpentMinutes: Math.floor(Math.random() * 20) + 5,
          }
          return {
            ...e,
            completedLessons: [...e.completedLessons, lessonId],
            activityLog: [...e.activityLog, act],
          }
        }
        return e
      }),
    })),
  submitExam: (enrollmentId, lessonId, score) =>
    set((s) => ({
      enrollments: s.enrollments.map((e) => {
        if (e.id === enrollmentId) {
          const act: ActivityLog = {
            id: `act_${Date.now()}`,
            date: new Date().toISOString(),
            type: 'exam_attempt',
            details: `Prova concluída com nota ${score.toFixed(0)}`,
            timeSpentMinutes: Math.floor(Math.random() * 30) + 10,
          }
          return {
            ...e,
            examScores: { ...e.examScores, [lessonId]: score },
            activityLog: [...e.activityLog, act],
          }
        }
        return e
      }),
    })),
  addForumQuestion: (q) => set((s) => ({ forumQuestions: [...s.forumQuestions, q] })),
  addForumReply: (qId, r) =>
    set((s) => ({
      forumQuestions: s.forumQuestions.map((fq) =>
        fq.id === qId ? { ...fq, replies: [...fq.replies, r] } : fq,
      ),
    })),
  resolveForumQuestion: (qId) =>
    set((s) => ({
      forumQuestions: s.forumQuestions.map((fq) =>
        fq.id === qId ? { ...fq, resolved: true } : fq,
      ),
    })),
  updatePaymentSettings: (s) => set({ paymentSettings: s }),
}))
