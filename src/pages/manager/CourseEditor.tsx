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
      modules: [],
    }
  })

  if (!course) return <div className="p-8">Curso não encontrado.</div>

  const handleSave = () => {
    if (!course.title || !course.area) return alert('Preencha título e área.')
    if (isNew) store.addCourse(course)
    else store.updateCourse(course)
    navigate('/manager/courses')
  }

  const addModule = () => {
    const title = window.prompt('Nome do novo Módulo:')
    if (!title) return
    setCourse({
      ...course,
      modules: [...course.modules, { id: `m_${Date.now()}`, title, lessons: [] }],
    })
  }

  const addLesson = (moduleId: string) => {
    const title = window.prompt('Título da Aula:')
    if (!title) return
    let typeInput = window.prompt('Tipo da aula (1: Vídeo, 2: Texto, 3: Prova):', '1')
    const typeMap: Record<string, 'video' | 'text' | 'exam'> = {
      '1': 'video',
      '2': 'text',
      '3': 'exam',
    }
    const type = typeMap[typeInput || '1'] || 'video'

    const newLesson: any = { id: `l_${Date.now()}`, title, type }

    if (type === 'text') newLesson.content = 'Insira o conteúdo do texto aqui...'
    if (type === 'video') newLesson.content = 'https://img.usecurling.com/p/800/450?q=presentation'
    if (type === 'exam') {
      newLesson.questions = [
        {
          id: `q_${Date.now()}`,
          text: 'Pergunta de exemplo?',
          options: ['Opção A', 'Opção B (Certa)'],
          correctOptionIndex: 1,
        },
      ]
    }

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
            <Link to="/manager/courses">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {isNew ? 'Criar Novo Curso' : 'Editar Currículo'}
          </h1>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 size-4" /> Salvar Alterações
        </Button>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="space-y-6 pt-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Título do Curso</label>
              <Input
                value={course.title}
                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                placeholder="Ex: Gestão Ágil"
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Área / Categoria</label>
              <Input
                value={course.area}
                onChange={(e) => setCourse({ ...course, area: e.target.value })}
                placeholder="Ex: Negócios"
                className="bg-muted/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Descrição</label>
            <Textarea
              value={course.description}
              onChange={(e) => setCourse({ ...course, description: e.target.value })}
              placeholder="Descreva o objetivo do curso..."
              className="min-h-[100px] bg-muted/50"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
          <h2 className="text-lg font-semibold">Estrutura Modular</h2>
          <Button variant="outline" onClick={addModule} className="bg-background">
            <Plus className="mr-2 size-4" /> Novo Módulo
          </Button>
        </div>

        {course.modules.length > 0 ? (
          <Accordion
            type="multiple"
            defaultValue={course.modules.map((m) => m.id)}
            className="w-full space-y-3"
          >
            {course.modules.map((mod, mIdx) => (
              <AccordionItem
                key={mod.id}
                value={mod.id}
                className="border rounded-lg bg-card overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline px-5 py-4 bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <GripVertical className="size-4 text-muted-foreground opacity-50" />
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
                        className="flex justify-between items-center p-4 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground text-sm w-16">
                            Aula {lIdx + 1}
                          </span>
                          <span className="font-medium text-[15px]">{lesson.title}</span>
                          <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-sm">
                            {lesson.type}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                          onClick={() => {
                            if (!window.confirm('Excluir aula?')) return
                            const modules = course.modules.map((m) =>
                              m.id === mod.id
                                ? { ...m, lessons: m.lessons.filter((l) => l.id !== lesson.id) }
                                : m,
                            )
                            setCourse({ ...course, modules })
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-muted/5 border-t">
                    <Button variant="secondary" size="sm" onClick={() => addLesson(mod.id)}>
                      <Plus className="mr-2 size-3" /> Adicionar Conteúdo
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center p-12 border border-dashed rounded-xl text-muted-foreground">
            <p>Nenhum módulo criado. Comece estruturando o conteúdo do curso.</p>
          </div>
        )}
      </div>
    </div>
  )
}
