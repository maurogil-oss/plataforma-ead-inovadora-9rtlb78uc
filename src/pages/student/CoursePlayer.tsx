import { useParams, Link } from 'react-router-dom'
import { useLmsStore } from '@/stores/lmsStore'
import { Button } from '@/components/ui/button'
import { ArrowLeft, PlayCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function CoursePlayer() {
  const { id } = useParams()
  const { courses } = useLmsStore()
  const course = courses.find((c) => c.id === id) || courses[0]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10 animate-in fade-in duration-700">
      <Button variant="ghost" asChild className="mb-2">
        <Link to="/student/courses">
          <ArrowLeft className="mr-2 size-4" /> Voltar
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-black rounded-xl shadow-xl overflow-hidden relative flex items-center justify-center border border-slate-800 group">
            <img
              src={course.thumbnail}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
              alt={course.title}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <PlayCircle className="size-20 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 cursor-pointer" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold mb-3 text-brand">{course.title}</h1>
            <p className="text-muted-foreground leading-relaxed text-lg">{course.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg uppercase tracking-wider text-muted-foreground">
            Conteúdo do Programa
          </h3>
          {course.modules.map((mod, i) => (
            <Card key={mod.id} className="border-border shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h4 className="font-bold text-sm text-foreground">
                  Módulo {i + 1}: {mod.title}
                </h4>
              </div>
              <CardContent className="p-0">
                <ul className="divide-y divide-border">
                  {mod.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="p-4 hover:bg-muted/50 transition-colors flex items-start gap-3 cursor-pointer"
                    >
                      <CheckCircle2 className="size-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{lesson.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge
                            variant="secondary"
                            className="text-[10px] uppercase font-bold tracking-wider"
                          >
                            {lesson.type === 'video'
                              ? 'Vídeo'
                              : lesson.type === 'exam'
                                ? 'Avaliação'
                                : 'Material'}
                          </Badge>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
