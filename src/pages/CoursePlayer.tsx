import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  MessageSquare,
  FileText,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Textarea } from '@/components/ui/textarea'
import { useSidebar } from '@/components/ui/sidebar'
import { useToast } from '@/hooks/use-toast'
import { MOCK_COURSES } from '@/data/mock'

const modules = [
  {
    id: 'm1',
    title: 'Fundamentos',
    lessons: [
      { title: 'Introdução à Direção Defensiva', duration: '5:00', completed: true },
      { title: 'Estatísticas de Acidentes', duration: '8:30', completed: true },
    ],
  },
  {
    id: 'm2',
    title: 'Percepção de Risco',
    lessons: [
      { title: 'O que é Risco?', duration: '12:00', completed: false, active: true },
      { title: 'Condições Adversas', duration: '15:45', completed: false },
    ],
  },
]

export default function CoursePlayer() {
  const { id } = useParams()
  const { setOpen } = useSidebar()
  const { toast } = useToast()
  const [note, setNote] = useState('')
  const course = MOCK_COURSES.find((c) => c.id === id) || MOCK_COURSES[0]

  // Auto-collapse sidebar for distraction-free mode
  useEffect(() => {
    setOpen(false)
    return () => setOpen(true)
  }, [setOpen])

  const handleSaveNote = () => {
    if (!note.trim()) return
    toast({
      title: 'Nota salva!',
      description: 'Sua anotação foi guardada com sucesso no tempo 04:20.',
      className: 'border-primary',
    })
    setNote('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Link to="/">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold truncate">{course.title}</h1>
          <p className="text-sm text-muted-foreground">Módulo 2: Percepção de Risco - Aula 1</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Video Area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-elevation group">
            {/* Fake Video Player */}
            <img
              src={course.thumbnail}
              alt="Video poster"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
              <Button
                size="icon"
                variant="ghost"
                className="size-16 rounded-full bg-primary/90 text-primary-foreground hover:scale-110 transition-transform"
              >
                <PlayCircle className="size-8" />
              </Button>
            </div>
            {/* Fake Controls */}
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/80 to-transparent flex items-end px-4 pb-3">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-primary rounded-full relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full shadow" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 glass-card rounded-xl">
            <div>
              <h2 className="font-bold text-lg">O que é Risco?</h2>
              <p className="text-sm text-muted-foreground">Instrutor: {course.instructor}</p>
            </div>
            <Button
              onClick={() =>
                toast({
                  title: '+50 XP Ganhos!',
                  description: 'Aula concluída com sucesso.',
                  className: 'bg-success/20 border-success text-success-foreground',
                })
              }
            >
              <CheckCircle2 className="mr-2 size-4" /> Marcar como Concluída
            </Button>
          </div>
        </div>

        {/* Sidebar Tabs */}
        <div className="w-full lg:w-[400px] flex flex-col h-full glass-card rounded-xl overflow-hidden">
          <Tabs defaultValue="content" className="flex flex-col h-full">
            <TabsList className="w-full justify-start rounded-none border-b border-white/10 bg-transparent p-0">
              <TabsTrigger
                value="content"
                className="flex-1 data-[state=active]:bg-white/5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Conteúdo
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="flex-1 data-[state=active]:bg-white/5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Anotações
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="flex-1 data-[state=active]:bg-white/5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="size-3" /> Mentor IA
                </span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-4">
              <TabsContent value="content" className="m-0 border-0 p-0">
                <Accordion type="single" collapsible defaultValue="m2">
                  {modules.map((mod) => (
                    <AccordionItem key={mod.id} value={mod.id} className="border-white/10">
                      <AccordionTrigger className="hover:no-underline hover:text-primary text-sm font-semibold py-3">
                        {mod.title}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-1 pb-4">
                        {mod.lessons.map((lesson, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-3 p-2 rounded-md text-sm transition-colors ${lesson.active ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-white/5'}`}
                          >
                            {lesson.completed ? (
                              <CheckCircle2 className="size-4 text-success" />
                            ) : (
                              <PlayCircle className="size-4 text-muted-foreground" />
                            )}
                            <span className="flex-1 line-clamp-1">{lesson.title}</span>
                            <span className="text-xs opacity-60">{lesson.duration}</span>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Materiais Complementares
                  </h4>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-white/10 hover:bg-white/5"
                  >
                    <FileText className="mr-2 size-4 text-accent" /> Manual_Condutor_2026.pdf
                    <Download className="ml-auto size-4 opacity-50" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="m-0 border-0 p-0 flex flex-col h-full gap-4">
                <p className="text-sm text-muted-foreground">
                  Salve anotações atreladas ao tempo do vídeo atual.
                </p>
                <Textarea
                  placeholder="Digite sua anotação aqui..."
                  className="min-h-[150px] resize-none bg-black/20 border-white/10"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button onClick={handleSaveNote} className="w-full">
                  Salvar Nota (04:20)
                </Button>
              </TabsContent>

              <TabsContent value="ai" className="m-0 border-0 p-0 text-center space-y-4 pt-8">
                <div className="size-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  <MessageSquare className="size-8" />
                </div>
                <h3 className="font-bold">Mentor IA do ONSV</h3>
                <p className="text-sm text-muted-foreground">
                  Tem dúvidas sobre a regra de distância de seguimento? Pergunte ao assistente
                  virtual.
                </p>
                <Button variant="secondary" className="w-full mt-4 border border-white/10">
                  Iniciar Chat
                </Button>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
