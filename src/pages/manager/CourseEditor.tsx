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
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react'
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
    const newLesson: any = { id: `l_${Date.now()}`, title, type: 'video' }
    setCourse({
      ...course,
      modules: course.modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m,
      ),
    })
  }

  const updateLesson = (modId: string, lessonId: string, data: any) => {
    setCourse({
      ...course,
      modules: course.modules.map((m) =>
        m.id === modId
          ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...data } : l)) }
          : m,
      ),
    })
  }

  const updateModule = (modId: string, data: any) => {
    setCourse({
      ...course,
      modules: course.modules.map((m) => (m.id === modId ? { ...m, ...data } : m)),
    })
  }

  const allModules = course.modules
  const allLessons = course.modules.flatMap((m) => m.lessons)

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
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
          <div className="grid sm:grid-cols-2 gap-6">
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
          <h2 className="text-lg font-semibold">Estrutura de Módulos & Trilhas</h2>
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
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-base">
                    Módulo {mIdx + 1}: {mod.title}
                  </span>
                  {mod.prerequisiteModuleIds && mod.prerequisiteModuleIds.length > 0 && (
                    <span className="text-xs text-muted-foreground font-normal">
                      Pré-requisitos: {mod.prerequisiteModuleIds.length} módulo(s)
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0 border-t">
                <div className="p-4 bg-muted/10 border-b space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      Módulos Pré-requisitos (Bloqueio Condicional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allModules
                        .filter((m) => m.id !== mod.id)
                        .map((otherMod) => (
                          <label
                            key={otherMod.id}
                            className="flex items-center space-x-2 border p-2 rounded bg-background text-sm cursor-pointer"
                          >
                            <Checkbox
                              checked={mod.prerequisiteModuleIds?.includes(otherMod.id)}
                              onCheckedChange={(c) => {
                                let reqs = mod.prerequisiteModuleIds || []
                                reqs = c
                                  ? [...reqs, otherMod.id]
                                  : reqs.filter((id) => id !== otherMod.id)
                                updateModule(mod.id, { prerequisiteModuleIds: reqs })
                              }}
                            />
                            <span>{otherMod.title}</span>
                          </label>
                        ))}
                      {allModules.length <= 1 && (
                        <span className="text-xs text-muted-foreground">
                          Nenhum outro módulo disponível.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="divide-y">
                  {mod.lessons.map((lesson, lIdx) => (
                    <div key={lesson.id} className="p-4 hover:bg-muted/5 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-mono text-sm">
                            A{lIdx + 1}
                          </span>
                          <Input
                            value={lesson.title}
                            onChange={(e) =>
                              updateLesson(mod.id, lesson.id, { title: e.target.value })
                            }
                            className="h-8 w-64 font-medium"
                          />
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-md border">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold">Tipo de Conteúdo</label>
                            <Select
                              value={lesson.type}
                              onValueChange={(v) => {
                                const update: any = { type: v }
                                if (v === 'exam' && !lesson.examConfig)
                                  update.examConfig = { mode: 'random', randomCount: 5 }
                                updateLesson(mod.id, lesson.id, update)
                              }}
                            >
                              <SelectTrigger className="h-8 bg-background">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="video">Vídeo</SelectItem>
                                <SelectItem value="pdf">Documento PDF</SelectItem>
                                <SelectItem value="excel">Planilha Excel</SelectItem>
                                <SelectItem value="audio">Áudio / Podcast</SelectItem>
                                <SelectItem value="image">Imagem</SelectItem>
                                <SelectItem value="text">Texto Rico</SelectItem>
                                <SelectItem value="exam">Avaliação / Prova</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {lesson.type !== 'exam' && lesson.type !== 'text' && (
                            <div className="space-y-1">
                              <label className="text-xs font-semibold">
                                URL da Mídia / Arquivo
                              </label>
                              <Input
                                className="h-8 bg-background"
                                placeholder="https://..."
                                value={lesson.mediaUrl || ''}
                                onChange={(e) =>
                                  updateLesson(mod.id, lesson.id, { mediaUrl: e.target.value })
                                }
                              />
                            </div>
                          )}

                          {(lesson.type === 'pdf' ||
                            lesson.type === 'excel' ||
                            lesson.type === 'image') && (
                            <div className="flex items-center space-x-2 pt-1">
                              <Checkbox
                                id={`dl-${lesson.id}`}
                                checked={lesson.downloadable}
                                onCheckedChange={(c) =>
                                  updateLesson(mod.id, lesson.id, { downloadable: !!c })
                                }
                              />
                              <label htmlFor={`dl-${lesson.id}`} className="text-sm cursor-pointer">
                                Permitir download do material
                              </label>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4 border-l pl-6">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-primary">
                              Aulas Pré-requisito (Bloqueio)
                            </label>
                            <Select
                              value="add"
                              onValueChange={(v) => {
                                if (v === 'none' || lesson.prerequisiteLessonIds?.includes(v))
                                  return
                                updateLesson(mod.id, lesson.id, {
                                  prerequisiteLessonIds: [
                                    ...(lesson.prerequisiteLessonIds || []),
                                    v,
                                  ],
                                })
                              }}
                            >
                              <SelectTrigger className="h-8 bg-background">
                                <SelectValue placeholder="Adicionar pré-requisito..." />
                              </SelectTrigger>
                              <SelectContent>
                                {allLessons
                                  .filter((l) => l.id !== lesson.id)
                                  .map((l) => (
                                    <SelectItem key={l.id} value={l.id}>
                                      {l.title}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            {lesson.prerequisiteLessonIds &&
                              lesson.prerequisiteLessonIds.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {lesson.prerequisiteLessonIds.map((reqId) => {
                                    const reqL = allLessons.find((x) => x.id === reqId)
                                    return (
                                      <div
                                        key={reqId}
                                        className="flex justify-between items-center text-xs bg-background border px-2 py-1 rounded"
                                      >
                                        <span className="truncate pr-2">
                                          {reqL?.title || 'Aula Removida'}
                                        </span>
                                        <button
                                          onClick={() =>
                                            updateLesson(mod.id, lesson.id, {
                                              prerequisiteLessonIds:
                                                lesson.prerequisiteLessonIds!.filter(
                                                  (id) => id !== reqId,
                                                ),
                                            })
                                          }
                                          className="text-destructive hover:underline"
                                        >
                                          X
                                        </button>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                          </div>

                          {lesson.type === 'exam' && (
                            <div className="space-y-3 pt-2">
                              <div className="space-y-1">
                                <label className="text-xs font-semibold">
                                  Nota Mínima p/ Aprovação (0-100)
                                </label>
                                <Input
                                  type="number"
                                  className="h-8 bg-background"
                                  value={lesson.examConfig?.minGradeRequired || 0}
                                  onChange={(e) =>
                                    updateLesson(mod.id, lesson.id, {
                                      examConfig: {
                                        ...lesson.examConfig,
                                        minGradeRequired: Number(e.target.value),
                                      },
                                    })
                                  }
                                />
                                <p className="text-[10px] text-muted-foreground leading-tight">
                                  Se configurado, aulas que dependem desta prova só serão liberadas
                                  caso o aluno atinja a nota.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
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
