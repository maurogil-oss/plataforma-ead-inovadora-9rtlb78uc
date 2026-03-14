import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Info, Layers, Clock, Tag, PlusCircle } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useLmsStore } from '@/stores/lmsStore'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Index() {
  const { courses } = useLmsStore()
  const navigate = useNavigate()

  const featuredCourse = courses[0] || null
  const newReleases = [...courses].reverse().slice(0, 6)
  const popularCourses = [...courses].slice(0, 6)

  const coursesByArea = courses.reduce(
    (acc, c) => {
      if (!acc[c.area]) acc[c.area] = []
      acc[c.area].push(c)
      return acc
    },
    {} as Record<string, typeof courses>,
  )

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-50 overflow-x-hidden">
      <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent backdrop-blur-sm transition-all duration-300">
        <div className="container mx-auto px-4 md:px-8 h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo imgClassName="h-16 md:h-24 w-auto drop-shadow-md filter transition-transform hover:scale-105" />
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link
              to="/cursos"
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wide drop-shadow"
            >
              Catálogo
            </Link>
            <Link
              to="/sobre"
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wide drop-shadow"
            >
              Sobre a Academia
            </Link>
            <Link
              to="/planos"
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wide drop-shadow"
            >
              Planos
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              asChild
              className="hidden sm:inline-flex text-white font-bold hover:text-white hover:bg-white/10"
            >
              <Link to="/login">Entrar</Link>
            </Button>
            <Button
              className="font-bold shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              asChild
            >
              <Link to="/student/dashboard">Área do Aluno</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Netflix Style */}
        {featuredCourse ? (
          <section className="relative w-full h-[85vh] min-h-[600px] flex items-center mb-10">
            <div className="absolute inset-0">
              <img
                src={featuredCourse.thumbnail}
                alt={featuredCourse.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10 pt-20">
              <div className="max-w-3xl space-y-6 animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs px-3 py-1 border-none shadow-md">
                    Lançamento
                  </Badge>
                  <span className="text-slate-300 font-bold text-sm uppercase tracking-wider shadow-sm">
                    {featuredCourse.area}
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-lg">
                  {featuredCourse.title}
                </h1>
                <p className="text-xl text-slate-300 font-medium leading-relaxed max-w-2xl drop-shadow-md line-clamp-3">
                  {featuredCourse.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg font-bold shadow-xl bg-white text-slate-900 hover:bg-slate-200"
                    onClick={() => navigate('/login')}
                  >
                    <Play className="mr-2 size-5 fill-current" /> Assistir Agora
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg font-bold bg-slate-900/40 text-white border-white/30 hover:bg-slate-800 hover:text-white backdrop-blur-md"
                    onClick={() => navigate('/cursos')}
                  >
                    <Info className="mr-2 size-5" /> Mais Informações
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="h-32" />
        )}

        <div className="space-y-12 md:space-y-16 pb-24 -mt-20 relative z-20">
          {/* New Releases Carousel */}
          {newReleases.length > 0 && (
            <section className="container mx-auto px-4 md:px-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white px-1">
                Adicionados Recentemente
              </h2>
              <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
                <CarouselContent className="-ml-4 py-4 px-1">
                  {newReleases.map((course) => (
                    <CarouselItem
                      key={course.id}
                      className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                      <Card
                        className="group overflow-hidden border-slate-800 bg-slate-900 hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] hover:-translate-y-2 relative h-full flex flex-col cursor-pointer"
                        onClick={() => navigate('/cursos')}
                      >
                        <div className="aspect-[4/5] relative overflow-hidden bg-slate-800">
                          <img
                            src={course.thumbnail}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={course.title}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                          <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <Button
                              size="sm"
                              className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold shadow-md"
                            >
                              <PlusCircle className="mr-2 size-4" /> Detalhes
                            </Button>
                          </div>

                          <div className="absolute top-3 left-3 bg-red-600 text-white font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-widest shadow-md">
                            Novo
                          </div>
                        </div>
                        <CardContent className="p-4 flex-1 flex flex-col absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 pt-12 pb-4 pointer-events-none">
                          <h3 className="font-bold text-lg leading-tight text-white group-hover:text-primary transition-colors line-clamp-2">
                            {course.title}
                          </h3>
                          <div className="mt-2 flex items-center text-xs text-slate-300 font-medium gap-3">
                            <span className="text-green-400 font-bold">98% Relevante</span>
                            <span className="border border-slate-600 px-1.5 py-0.5 rounded text-[10px] uppercase">
                              {course.area}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden lg:block">
                  <CarouselPrevious className="-left-5 h-14 w-14 border-0 bg-slate-900/80 text-white backdrop-blur shadow-lg hover:bg-white hover:text-slate-900 transition-colors" />
                  <CarouselNext className="-right-5 h-14 w-14 border-0 bg-slate-900/80 text-white backdrop-blur shadow-lg hover:bg-white hover:text-slate-900 transition-colors" />
                </div>
              </Carousel>
            </section>
          )}

          {/* Area Categories */}
          {Object.entries(coursesByArea).map(([area, areaCourses]) => (
            <section key={area} className="container mx-auto px-4 md:px-8 space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white px-1 flex items-center gap-3">
                {area} <ArrowRight className="size-5 text-slate-500" />
              </h2>
              <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
                <CarouselContent className="-ml-4 py-4 px-1">
                  {areaCourses.map((course) => (
                    <CarouselItem
                      key={course.id}
                      className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                      <Card
                        className="group overflow-hidden border-slate-800 bg-slate-900 hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] hover:-translate-y-2 relative h-full flex flex-col cursor-pointer"
                        onClick={() => navigate('/cursos')}
                      >
                        <div className="aspect-video relative overflow-hidden bg-slate-800">
                          <img
                            src={course.thumbnail}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={course.title}
                          />
                          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="size-12 text-white drop-shadow-lg fill-current scale-90 group-hover:scale-100 transition-transform duration-300" />
                          </div>
                        </div>
                        <CardContent className="p-4 flex-1 flex flex-col bg-slate-900 border-t border-slate-800">
                          <h3 className="font-bold text-base leading-tight text-slate-100 group-hover:text-white transition-colors flex-1 line-clamp-2">
                            {course.title}
                          </h3>
                          <div className="mt-3 flex items-center text-xs text-slate-400 font-medium gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" /> {course.modules.length * 2}h
                            </span>
                            <span className="flex items-center gap-1">
                              <Layers className="size-3" /> {course.modules.length} Mód.
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden lg:block">
                  <CarouselPrevious className="-left-5 h-14 w-14 border-0 bg-slate-900/80 text-white backdrop-blur shadow-lg hover:bg-white hover:text-slate-900 transition-colors" />
                  <CarouselNext className="-right-5 h-14 w-14 border-0 bg-slate-900/80 text-white backdrop-blur shadow-lg hover:bg-white hover:text-slate-900 transition-colors" />
                </div>
              </Carousel>
            </section>
          ))}
        </div>
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <Logo imgClassName="h-16 w-auto opacity-70 hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-base text-slate-400 max-w-sm leading-relaxed font-medium">
                Transformando o futuro da educação através de tecnologia, inovação e excelência
                pedagógica.
              </p>
            </div>
            <div>
              <h4 className="text-slate-200 font-bold mb-6 tracking-wide uppercase">Plataforma</h4>
              <ul className="space-y-4 text-sm font-semibold">
                <li>
                  <Link to="/cursos" className="hover:text-white transition-colors">
                    Catálogo de Cursos
                  </Link>
                </li>
                <li>
                  <Link to="/sobre" className="hover:text-white transition-colors">
                    Sobre a Academia
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-200 font-bold mb-6 tracking-wide uppercase">Suporte</h4>
              <ul className="space-y-4 text-sm font-semibold">
                <li>
                  <Link to="/contato" className="hover:text-white transition-colors">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link to="/planos" className="hover:text-white transition-colors">
                    Planos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-bold">
            <p>
              &copy; {new Date().getFullYear()} Observatório Academy (DEMO). Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
