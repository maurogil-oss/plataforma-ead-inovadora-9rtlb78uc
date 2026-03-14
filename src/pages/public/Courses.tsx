import { Link } from 'react-router-dom'
import { PublicHeader } from '@/components/PublicHeader'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tag, PlayCircle, Clock, Layers, Sparkles } from 'lucide-react'
import { useLmsStore } from '@/stores/lmsStore'

export default function Courses() {
  const { courses } = useLmsStore()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <PublicHeader />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
            Catálogo de Cursos
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            Explore nossos cursos de alta qualidade e seja um especialista nas áreas de Segurança
            Viária, Mobilidade e Cidades Inteligentes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((c) => (
            <Card
              key={c.id}
              className="group overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 border-slate-800 bg-slate-900 cursor-pointer"
            >
              <div className="relative aspect-video bg-slate-800 overflow-hidden">
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayCircle className="size-16 text-white drop-shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300" />
                </div>

                <Badge className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white border-none shadow-md font-black uppercase tracking-widest text-[10px]">
                  {c.area}
                </Badge>

                {c.isNew && (
                  <div className="absolute top-3 left-3 bg-blue-600 text-white font-black px-2.5 py-0.5 rounded text-[10px] uppercase tracking-widest shadow-md z-30 flex items-center gap-1">
                    <Sparkles className="size-3" /> Novo
                  </div>
                )}

                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white font-black px-2 py-1 rounded shadow-sm flex items-center gap-1.5 text-xs border border-white/10">
                  <Tag className="size-3 text-primary" /> R$ {c.price.toFixed(2)}
                </div>
              </div>
              <CardContent className="flex-1 p-5 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 pt-16 pb-5 pointer-events-none">
                <CardTitle className="line-clamp-2 text-xl leading-tight text-white group-hover:text-primary transition-colors font-bold mb-2">
                  {c.title}
                </CardTitle>
                <div className="flex items-center text-xs text-slate-300 font-bold gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> {c.modules.length * 2}h
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="size-3" /> {c.modules.length} Módulos
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 p-4 bg-slate-900 border-t border-slate-800">
                <Button
                  className="w-full font-bold shadow-md text-base bg-white text-slate-900 hover:bg-slate-200"
                  asChild
                >
                  <Link to="/login">Assinar e Assistir</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
