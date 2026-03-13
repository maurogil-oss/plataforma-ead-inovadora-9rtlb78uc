import { create } from 'zustand'

export type LessonType = 'video' | 'text' | 'exam'
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
}
export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}
export interface Course {
  id: string
  title: string
  area: string
  description: string
  thumbnail: string
  modules: Module[]
}
export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  completedLessons: string[]
  examScores: Record<string, number>
}
export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'manager'
  avatar?: string
}

const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Fundamentos de Gestão de Projetos',
    area: 'Gestão Empresarial',
    description:
      'Aprenda os conceitos básicos para gerenciar projetos com eficácia na sua organização.',
    thumbnail: 'https://img.usecurling.com/p/800/600?q=business%20meeting&color=blue',
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
              'O ciclo de vida de um projeto é composto por iniciação, planejamento, execução, monitoramento e encerramento. Cada fase possui entregáveis específicos e exige diferentes habilidades da equipe envolvida para o sucesso das entregas.',
          },
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
                text: 'Quais são as fases do ciclo de vida de um projeto?',
                options: [
                  'Iniciação e Encerramento apenas',
                  'Iniciação, Planejamento, Execução, Monitoramento e Controle, Encerramento',
                  'Planejamento e Execução',
                  'Análise, Design, Desenvolvimento, Testes',
                ],
                correctOptionIndex: 1,
              },
              {
                id: 'q2',
                text: 'O que caracteriza um projeto?',
                options: [
                  'Esforço temporário para criar um produto ou serviço exclusivo.',
                  'Operação contínua e repetitiva da empresa.',
                  'Qualquer tarefa que dure mais de um mês.',
                  'Um departamento fixo da organização.',
                ],
                correctOptionIndex: 0,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'c2',
    title: 'Segurança da Informação Básica',
    area: 'Tecnologia',
    description:
      'Boas práticas para manter a segurança dos dados no ambiente de trabalho corporativo.',
    thumbnail: 'https://img.usecurling.com/p/800/600?q=cyber%20security&color=green',
    modules: [
      {
        id: 'm3',
        title: 'Conceitos Iniciais',
        lessons: [
          {
            id: 'l4',
            title: 'Senhas Seguras',
            type: 'text',
            content:
              'Sempre utilize senhas complexas, combinando letras maiúsculas, minúsculas, números e caracteres especiais. Nunca reutilize senhas importantes em múltiplos sistemas.',
          },
          {
            id: 'l5',
            title: 'Phishing: Como identificar',
            type: 'video',
            content: 'https://img.usecurling.com/p/1280/720?q=hacker',
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
  {
    id: 's2',
    name: 'Maria Souza',
    email: 'maria.souza@empresa.com',
    role: 'student',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?seed=maria',
  },
]

const MOCK_ENROLLMENTS: Enrollment[] = [
  { id: 'e1', studentId: 's1', courseId: 'c1', completedLessons: ['l1'], examScores: {} },
]

interface LMSStore {
  courses: Course[]
  enrollments: Enrollment[]
  students: User[]
  addCourse: (c: Course) => void
  updateCourse: (c: Course) => void
  deleteCourse: (id: string) => void
  enrollStudent: (studentId: string, courseId: string) => void
  unenrollStudent: (studentId: string, courseId: string) => void
  markLessonComplete: (enrollmentId: string, lessonId: string) => void
  submitExam: (enrollmentId: string, lessonId: string, score: number) => void
}

export const useLmsStore = create<LMSStore>((set) => ({
  courses: MOCK_COURSES,
  students: MOCK_STUDENTS,
  enrollments: MOCK_ENROLLMENTS,

  addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
  updateCourse: (course) =>
    set((state) => ({ courses: state.courses.map((c) => (c.id === course.id ? course : c)) })),
  deleteCourse: (id) => set((state) => ({ courses: state.courses.filter((c) => c.id !== id) })),

  enrollStudent: (studentId, courseId) =>
    set((state) => {
      if (state.enrollments.some((e) => e.studentId === studentId && e.courseId === courseId))
        return state
      return {
        enrollments: [
          ...state.enrollments,
          {
            id: `e_${Date.now()}`,
            studentId,
            courseId,
            completedLessons: [],
            examScores: {},
          },
        ],
      }
    }),
  unenrollStudent: (studentId, courseId) =>
    set((state) => ({
      enrollments: state.enrollments.filter(
        (e) => !(e.studentId === studentId && e.courseId === courseId),
      ),
    })),

  markLessonComplete: (enrollmentId, lessonId) =>
    set((state) => ({
      enrollments: state.enrollments.map((e) => {
        if (e.id === enrollmentId && !e.completedLessons.includes(lessonId)) {
          return { ...e, completedLessons: [...e.completedLessons, lessonId] }
        }
        return e
      }),
    })),
  submitExam: (enrollmentId, lessonId, score) =>
    set((state) => ({
      enrollments: state.enrollments.map((e) => {
        if (e.id === enrollmentId) {
          return { ...e, examScores: { ...e.examScores, [lessonId]: score } }
        }
        return e
      }),
    })),
}))
