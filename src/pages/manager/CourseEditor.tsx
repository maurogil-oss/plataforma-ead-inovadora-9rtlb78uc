import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useLmsStore, Course, MediaAsset } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  DollarSign,
  FolderOpen,
  Search,
  FileText,
  Video,
  Image as ImageIcon,
  File,
} from 'lucide-react'
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
      price: 197.0,
      thumbnail: 'https://img.usecurling.com/p/600/400?q=education',
      passingGrade: 70,
      batches: [],
      modules: [],
      instructorId: user?.role === 'instructor' ? user.id : '',
    }
  })

  const [mediaSelectLesson, setMediaSelectLesson] = useState<{
    modId: string
    lessonId: string
  } | null>(null)
  const [mediaSearch, setMediaSearch] = useState('')

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

  const onSelectAsset = (asset: MediaAsset) => {
    if (!mediaSelectLesson) return
    let newType = 'video'
    if (asset.type === 'pdf') newType = 'pdf'
    if (asset.type === 'image') newType = 'image'
    if (asset.type === 'document') newType = 'file'

    updateLesson(mediaSelectLesson.modId, mediaSelectLesson.lessonId, {
      assetId: asset.id,
      mediaUrl: asset.url,
      type: newType,
    })
    setMediaSelectLesson(null)
    toast.success('Arquivo vinculado à aula!')
  }

  const allModules = course.modules
  const allLessons = course.modules.flatMap((m) => m.lessons)
  const filteredModalAssets = store.mediaAssets.filter((a) =>
    a.name.toLowerCase().includes(mediaSearch.toLowerCase()),
  )

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
        <Button onClick={handleSave} className="font-bold shadow-md">
          <Save className="mr-2 size-4" /> Salvar Curso
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
            <div className="space-y-2">
              <label className="text-sm font-semibold">Preço de Venda (R$)</label>
              <Input
                type="number"
                value={course.price}
                onChange={(e) => setCourse({ ...course, price: Number(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {user?.role === 'manager' && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="size-5 text-primary" /> Financeiro e Comissões
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sobrescreva as taxas padrões globais apenas para este curso. Deixe em branco para usar
              o padrão.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Comissão Professor (%)</label>
                <Input
                  type="number"
                  placeholder="Ex: 50"
                  value={course.instructorRateOverride || ''}
                  onChange={(e) =>
                    setCourse({
                      ...course,
                      instructorRateOverride: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Comissão Afiliado/Parceiro (%)</label>
                <Input
                  type="number"
                  placeholder="Ex: 20"
                  value={course.partnerRateOverride || ''}
                  onChange={(e) =>
                    setCourse({
                      ...course,
                      partnerRateOverride: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
          <h2 className="text-lg font-semibold">Estrutura de Módulos & Trilhas</h2>
          <Button
            variant="outline"
            className="font-bold"
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
                                <SelectItem value="file">Arquivo Genérico</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {lesson.type !== 'exam' && lesson.type !== 'text' && (
                            <div className="space-y-1">
                              <label className="text-xs font-semibold">
                                URL da Mídia / Arquivo
                              </label>
                              <div className="flex items-center gap-2">
                                <Input
                                  className="h-8 bg-background flex-1"
                                  placeholder="https://..."
                                  value={lesson.mediaUrl || ''}
                                  onChange={(e) =>
                                    updateLesson(mod.id, lesson.id, {
                                      mediaUrl: e.target.value,
                                      assetId: undefined,
                                    })
                                  }
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setMediaSelectLesson({ modId: mod.id, lessonId: lesson.id })
                                  }
                                  className="h-8 shrink-0 font-bold text-primary"
                                >
                                  <FolderOpen className="mr-2 size-3" /> Biblioteca
                                </Button>
                              </div>
                              {lesson.assetId && (
                                <p className="text-[10px] text-primary mt-1 font-semibold flex items-center gap-1">
                                  <FolderOpen className="size-3" /> Arquivo vinculado à Biblioteca
                                </p>
                              )}
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-muted/5 border-t">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => addLesson(mod.id)}
                    className="font-bold"
                  >
                    <Plus className="mr-2 size-3" /> Adicionar Aula
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Dialog open={!!mediaSelectLesson} onOpenChange={(o) => !o && setMediaSelectLesson(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FolderOpen className="size-5 text-primary" /> Selecionar Arquivo da Biblioteca
            </DialogTitle>
          </DialogHeader>
          <div className="relative mb-4 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar arquivo..."
              className="pl-9 h-11"
              value={mediaSearch}
              onChange={(e) => setMediaSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredModalAssets.map((asset) => (
              <Card
                key={asset.id}
                className="cursor-pointer hover:border-primary border-transparent border bg-muted/30 transition-colors flex flex-col group"
                onClick={() => onSelectAsset(asset)}
              >
                <div className="h-24 bg-muted flex items-center justify-center border-b">
                  {asset.type === 'video' && (
                    <Video className="size-8 text-slate-400 group-hover:scale-110 transition-transform" />
                  )}
                  {asset.type === 'pdf' && (
                    <FileText className="size-8 text-slate-400 group-hover:scale-110 transition-transform" />
                  )}
                  {asset.type === 'image' && (
                    <ImageIcon className="size-8 text-slate-400 group-hover:scale-110 transition-transform" />
                  )}
                  {asset.type === 'document' && (
                    <File className="size-8 text-slate-400 group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="font-bold text-sm line-clamp-2 leading-tight mb-1">{asset.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                    {asset.type}
                  </p>
                </CardContent>
              </Card>
            ))}
            {filteredModalAssets.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <FolderOpen className="size-10 mx-auto mb-2 opacity-30" />
                <p>Nenhum arquivo encontrado.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
