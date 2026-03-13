import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useLmsStore, Course } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Plus, Trash2, ArrowLeft, Save, GripVertical } from 'lucide-react'
import { toast } from 'sonner'

export default function CourseEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const store = useLmsStore()
  const isNew = !id
  const basePath = user?.role === 'instructor' ? '/instructor' : '/manager'

  const [course, setCourse] = useState<Course>(() => {
    if (!isNew) return store.courses.find((c) => c.id === id) as Course
    return {
      id: `c_${Date.now()}`,
      title: '',
      area: '',
      description: '',
      thumbnail: 'https://img.usecurling.com/p/600/400?q=education',
      passingGrade: 70,
      batches: [],
      modules: [],
      instructorId: user?.role === 'instructor' ? user.id : '',
    }
  })

  if (!course) return <div className="p-8">Curso não encontrado.</div>

  const handleSave = () => {
    if (!course.title || !course.area) return toast.error('Preencha título e área.')
    if (isNew) store.addCourse(course)
    else store.updateCourse(course)
    toast.success('Curso salvo com sucesso!')
    navigate(`${basePath}/courses`)
  }

  const addLesson = (moduleId: string) => {
    const title = window.prompt('Título da Aula:')
    if (!title) return
    const typeInput = window.prompt('Tipo (1: Vídeo, 2: Texto, 3: Prova, 4: Arquivo):', '1')
    const typeMap: Record<string, any> = { '1': 'video', '2': 'text', '3': 'exam', '4': 'file' }
    const type = typeMap[typeInput || '1'] || 'video'
    const newLesson: any = { id: `l_${Date.now()}`, title, type }

    if (type === 'exam')
      newLesson.examConfig = { mode: 'random', randomCount: 5, randomCategory: 'Geral' }
    else if (type === 'video')
      newLesson.content = 'https://img.usecurling.com/p/800/450?q=presentation'

    setCourse({
      ...course,
      modules: course.modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m,
      ),
    })
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`${basePath}/courses`}>
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
              <label className="text-sm font-semibold">Nota Aprovação (%)</label>
              <Input
                type="number"
                value={course.passingGrade}
                onChange={(e) => setCourse({ ...course, passingGrade: Number(e.target.value) })}
              />
            </div>
            {user?.role === 'manager' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">Professor/Instrutor</label>
                <Select
                  value={course.instructorId || ''}
                  onValueChange={(v) => setCourse({ ...course, instructorId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um professor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {store.instructors.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
          <h2 className="text-lg font-semibold">Estrutura de Módulos</h2>
          <Button
            variant="outline"
            onClick={() =>
              setCourse({
                ...course,
                modules: [
                  ...course.modules,
                  { id: `m_${Date.now()}`, title: 'Novo Módulo', lessons: [] },
                ],
              })
            }
          >
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
              <AccordionTrigger className="px-5 py-4 hover:no-underline">
                <span className="font-semibold text-base">
                  Módulo {mIdx + 1}: {mod.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="p-0 border-t">
                <div className="divide-y">
                  {mod.lessons.map((lesson, lIdx) => (
                    <div key={lesson.id} className="p-4 hover:bg-muted/20">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground text-sm">Aula {lIdx + 1}</span>
                          <span className="font-medium">{lesson.title}</span>
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
                      {lesson.type === 'exam' && (
                        <div className="mt-4 p-4 bg-muted/30 border rounded-md space-y-4">
                          <p className="text-sm font-semibold">Configuração da Prova</p>
                          <Select
                            value={lesson.examConfig?.mode || 'random'}
                            onValueChange={(v) =>
                              setCourse({
                                ...course,
                                modules: course.modules.map((m) =>
                                  m.id === mod.id
                                    ? {
                                        ...m,
                                        lessons: m.lessons.map((l) =>
                                          l.id === lesson.id
                                            ? {
                                                ...l,
                                                examConfig: { ...l.examConfig, mode: v as any },
                                              }
                                            : l,
                                        ),
                                      }
                                    : m,
                                ),
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="random">Sorteio Aleatório do Banco</SelectItem>
                              <SelectItem value="manual">Seleção Manual</SelectItem>
                            </SelectContent>
                          </Select>
                          {lesson.examConfig?.mode === 'random' && (
                            <div className="flex gap-4">
                              <Input
                                placeholder="Categoria"
                                value={lesson.examConfig.randomCategory || ''}
                                onChange={(e) =>
                                  setCourse({
                                    ...course,
                                    modules: course.modules.map((m) =>
                                      m.id === mod.id
                                        ? {
                                            ...m,
                                            lessons: m.lessons.map((l) =>
                                              l.id === lesson.id
                                                ? {
                                                    ...l,
                                                    examConfig: {
                                                      ...l.examConfig,
                                                      randomCategory: e.target.value,
                                                    } as any,
                                                  }
                                                : l,
                                            ),
                                          }
                                        : m,
                                    ),
                                  })
                                }
                              />
                              <Input
                                type="number"
                                placeholder="Qtd"
                                value={lesson.examConfig.randomCount || 5}
                                onChange={(e) =>
                                  setCourse({
                                    ...course,
                                    modules: course.modules.map((m) =>
                                      m.id === mod.id
                                        ? {
                                            ...m,
                                            lessons: m.lessons.map((l) =>
                                              l.id === lesson.id
                                                ? {
                                                    ...l,
                                                    examConfig: {
                                                      ...l.examConfig,
                                                      randomCount: Number(e.target.value),
                                                    } as any,
                                                  }
                                                : l,
                                            ),
                                          }
                                        : m,
                                    ),
                                  })
                                }
                              />
                            </div>
                          )}
                          {lesson.examConfig?.mode === 'manual' && (
                            <p className="text-xs text-muted-foreground">
                              ID das questões:{' '}
                              {lesson.examConfig?.manualQuestionIds?.join(', ') || 'Nenhuma'}
                            </p>
                          )}
                        </div>
                      )}
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
