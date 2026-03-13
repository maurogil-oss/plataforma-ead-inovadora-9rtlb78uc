import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useLmsStore } from '@/stores/lmsStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Plus, Trash2, ArrowLeft, Save, GripVertical } from 'lucide-react'

export default function CourseEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const store = useLmsStore()
  const isNew = !id
  const [course, setCourse] = useState(() => {
    if (!isNew) return store.courses.find((c) => c.id === id) || null
    return {
      id: `c_${Date.now()}`,
      title: '',
      area: '',
      description: '',
      thumbnail: 'https://img.usecurling.com/p/600/400?q=education',
      passingGrade: 70,
      batches: [],
      modules: [],
    }
  })

  if (!course) return <div className="p-8">Curso não encontrado.</div>

  const handleSave = () => {
    if (!course.title || !course.area) return alert('Preencha título e área.')
    if (isNew) store.addCourse(course as any)
    else store.updateCourse(course as any)
    navigate('/manager/courses')
  }

  const addModule = () => {
    const title = window.prompt('Nome do novo Módulo:')
    if (title)
      setCourse({
        ...course,
        modules: [...course.modules, { id: `m_${Date.now()}`, title, lessons: [] }],
      })
  }

  const addLesson = (moduleId: string) => {
    const title = window.prompt('Título da Aula:')
    if (!title) return
    let typeInput = window.prompt(
      'Tipo da aula (1: Vídeo, 2: Texto, 3: Prova, 4: Arquivo Download):',
      '1',
    )
    const typeMap: Record<string, 'video' | 'text' | 'exam' | 'file'> = {
      '1': 'video',
      '2': 'text',
      '3': 'exam',
      '4': 'file',
    }
    const type = typeMap[typeInput || '1'] || 'video'
    const newLesson: any = { id: `l_${Date.now()}`, title, type }

    if (type === 'text') newLesson.content = 'Insira o texto aqui...'
    if (type === 'video') newLesson.content = 'https://img.usecurling.com/p/800/450?q=presentation'
    if (type === 'file') newLesson.fileUrl = 'https://example.com/material.pdf'
    if (type === 'exam')
      newLesson.questions = [
        {
          id: `q_${Date.now()}`,
          text: 'Pergunta?',
          options: ['A', 'B (Certa)'],
          correctOptionIndex: 1,
        },
      ]

    setCourse({
      ...course,
      modules: course.modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m,
      ),
    })
  }

  const addBatch = () => {
    const name = window.prompt('Nome da Turma:')
    if (name)
      setCourse({
        ...course,
        batches: [
          ...(course.batches || []),
          {
            id: `b_${Date.now()}`,
            name,
            startDate: new Date().toISOString().split('T')[0],
            endDate: '2026-12-31',
            capacity: 50,
          },
        ],
      })
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/manager/courses">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{isNew ? 'Criar Curso' : 'Editar Curso'}</h1>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 size-4" /> Salvar
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Título</label>
              <Input
                value={course.title}
                onChange={(e) => setCourse({ ...course, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Área</label>
              <Input
                value={course.area}
                onChange={(e) => setCourse({ ...course, area: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Descrição</label>
            <Textarea
              value={course.description}
              onChange={(e) => setCourse({ ...course, description: e.target.value })}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Nota Média de Aprovação (%)</label>
              <Input
                type="number"
                value={course.passingGrade || 70}
                onChange={(e) => setCourse({ ...course, passingGrade: Number(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
          <h2 className="text-lg font-semibold">Turmas do Curso (Batches)</h2>
          <Button variant="outline" onClick={addBatch}>
            <Plus className="mr-2 size-4" /> Nova Turma
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {(course.batches || []).map((b) => (
            <Card key={b.id} className="p-4 flex flex-col gap-1 border-primary/20 bg-primary/5">
              <div className="font-bold">{b.name}</div>
              <div className="text-sm text-muted-foreground">
                {b.startDate} a {b.endDate}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-destructive self-start h-8"
                onClick={() =>
                  setCourse({ ...course, batches: course.batches.filter((x) => x.id !== b.id) })
                }
              >
                Remover
              </Button>
            </Card>
          ))}
          {(!course.batches || course.batches.length === 0) && (
            <p className="text-muted-foreground text-sm col-span-2">
              Sem turmas. Alunos terão acesso livre a qualquer momento.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
          <h2 className="text-lg font-semibold">Estrutura de Módulos</h2>
          <Button variant="outline" onClick={addModule}>
            <Plus className="mr-2 size-4" /> Novo Módulo
          </Button>
        </div>
        <Accordion
          type="multiple"
          defaultValue={course.modules.map((m) => m.id)}
          className="w-full space-y-3"
        >
          {course.modules.map((mod, mIdx) => (
            <AccordionItem key={mod.id} value={mod.id} className="border rounded-lg bg-card">
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/20">
                <div className="flex items-center gap-3">
                  <GripVertical className="size-4 opacity-50" />
                  <span className="font-semibold text-base">
                    Módulo {mIdx + 1}: {mod.title}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0 border-t">
                <div className="divide-y">
                  {mod.lessons.map((lesson, lIdx) => (
                    <div
                      key={lesson.id}
                      className="flex justify-between items-center p-4 hover:bg-muted/20"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground text-sm w-16">Aula {lIdx + 1}</span>
                        <span className="font-medium text-[15px]">{lesson.title}</span>
                        <span className="text-[10px] uppercase font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-sm">
                          {lesson.type}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() =>
                          setCourse({
                            ...course,
                            modules: course.modules.map((m) =>
                              m.id === mod.id
                                ? { ...m, lessons: m.lessons.filter((l) => l.id !== lesson.id) }
                                : m,
                            ),
                          })
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-muted/5 border-t">
                  <Button variant="secondary" size="sm" onClick={() => addLesson(mod.id)}>
                    <Plus className="mr-2 size-3" /> Adicionar Aula
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
