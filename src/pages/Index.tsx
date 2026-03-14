import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Info, Layers, Clock, PlusCircle, Sparkles } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useLmsStore, Course } from '@/stores/lmsStore'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const CourseCardRender = ({ course, navigate }: { course: Course; navigate: any }) => (
  <Card
    className="group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] hover:-translate-y-2 relative h-full flex flex-col cursor-pointer"
    onClick={() => navigate('/cursos')}
  >
    <div className="aspect-[4/5] sm:aspect-video relative overflow-hidden bg-slate-800">
      <img
        src={course.thumbnail}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        alt={course.title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
        <Play className="size-16 text-white drop-shadow-2xl fill-current scale-90 group-hover:scale-100 transition-transform duration-300" />
      </div>

      <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 hidden sm:block">
        <Button
          size="sm"
          className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold shadow-md"
        >
          <PlusCircle className="mr-2 size-4" /> Detalhes
        </Button>
      </div>

      {course.isNew && (
        <div className="absolute top-3 left-3 bg-blue-600 text-white font-black px-2.5 py-0.5 rounded text-[10px] uppercase tracking-widest shadow-md z-30 flex items-center gap-1">
          <Sparkles className="size-3" /> Novo
        </div>
      )}
    </div>
    <CardContent className="p-5 flex-1 flex flex-col absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 pt-16 pb-5 pointer-events-none z-10">
      <h3 className="font-bold text-lg sm:text-xl leading-tight text-white group-hover:text-primary transition-colors line-clamp-2">
        {course.title}
      </h3>
      <div className="mt-2 flex flex-wrap items-center text-xs sm:text-sm text-slate-300 font-medium gap-3">
        <span className="flex items-center gap-1.5 drop-shadow-md">
          <Clock className="size-3.5" /> {course.modules.length * 2}h
        </span>
        <span className="flex items-center gap-1.5 drop-shadow-md">
          <Layers className="size-3.5" /> {course.modules.length} Mód.
        </span>
        <span className="border border-slate-500 bg-slate-800/80 px-2 py-0.5 rounded text-[10px] uppercase drop-shadow-sm ml-auto">
          {course.area}
        </span>
      </div>
    </CardContent>
  </Card>
)

export default function Index() {
  const { courses } = useLmsStore()
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<'recent' | 'popular' | 'area'>('area')

  const featuredCourse = courses[0] || null

  const renderContent = () => {
    if (activeFilter === 'recent') {
      const recentCourses = [...courses].reverse()
      return (
        <section className="container mx-auto px-4 md:px-8 space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight px-1">Mais Recentes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-4">
            {recentCourses.map((course) => (
              <div key={course.id} className="relative z-10">
                <CourseCardRender course={course} navigate={navigate} />
              </div>
            ))}
          </div>
        </section>
      )
    }

    if (activeFilter === 'popular') {
      const popularCourses = [...courses].sort(
        (a, b) => (b.popularityScore || 0) - (a.popularityScore || 0),
      )
      return (
        <section className="container mx-auto px-4 md:px-8 space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight px-1">
            Populares e Em Alta
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-4">
            {popularCourses.map((course) => (
              <div key={course.id} className="relative z-10">
                <CourseCardRender course={course} navigate={navigate} />
              </div>
            ))}
          </div>
        </section>
      )
    }

    // Default 'area' view
    const newReleases = [...courses]
      .filter((c) => c.isNew)
      .reverse()
      .slice(0, 6)
    const coursesByArea = courses.reduce(
      (acc, c) => {
        if (!acc[c.area]) acc[c.area] = []
        acc[c.area].push(c)
        return acc
      },
      {} as Record<string, typeof courses>,
    )

    return (
      <>
        {newReleases.length > 0 && (
          <section className="container mx-auto px-4 md:px-8 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight px-1">
              Adicionados Recentemente
            </h2>
            <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
              <CarouselContent className="-ml-4 py-10 px-1">
                {newReleases.map((course) => (
                  <CarouselItem
                    key={course.id}
                    className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 relative z-10"
                  >
                    <CourseCardRender course={course} navigate={navigate} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden lg:block">
                <CarouselPrevious className="-left-6 h-16 w-16 border-0 bg-background/90 backdrop-blur shadow-2xl hover:bg-foreground hover:text-background transition-colors z-30" />
                <CarouselNext className="-right-6 h-16 w-16 border-0 bg-background/90 backdrop-blur shadow-2xl hover:bg-foreground hover:text-background transition-colors z-30" />
              </div>
            </Carousel>
          </section>
        )}

        {Object.entries(coursesByArea).map(([area, areaCourses]) => (
          <section key={area} className="container mx-auto px-4 md:px-8 space-y-6 mt-12">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight px-1 flex items-center gap-3">
              {area} <ArrowRight className="size-6 text-muted-foreground" />
            </h2>
            <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
              <CarouselContent className="-ml-4 py-10 px-1">
                {areaCourses.map((course) => (
                  <CarouselItem
                    key={course.id}
                    className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 relative z-10"
                  >
                    <CourseCardRender course={course} navigate={navigate} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden lg:block">
                <CarouselPrevious className="-left-6 h-16 w-16 border-0 bg-background/90 backdrop-blur shadow-2xl hover:bg-foreground hover:text-background transition-colors z-30" />
                <CarouselNext className="-right-6 h-16 w-16 border-0 bg-background/90 backdrop-blur shadow-2xl hover:bg-foreground hover:text-background transition-colors z-30" />
              </div>
            </Carousel>
          </section>
        ))}
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col font-sans overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-background/95 via-background/80 to-transparent backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto px-4 md:px-8 py-4 min-h-[100px] flex items-center justify-between gap-6">
          <Link to="/" className="flex shrink-0 z-50">
            <Logo imgClassName="h-12 md:h-16 lg:h-20 w-auto" />
          </Link>
          <nav className="hidden lg:flex gap-8 items-center flex-1 justify-center pl-8">
            <Link
              to="/cursos"
              className="text-sm font-bold text-foreground/80 hover:text-foreground transition-colors uppercase tracking-wide"
            >
              Catálogo
            </Link>
            <Link
              to="/sobre"
              className="text-sm font-bold text-foreground/80 hover:text-foreground transition-colors uppercase tracking-wide"
            >
              Sobre a Academia
            </Link>
            <Link
              to="/planos"
              className="text-sm font-bold text-foreground/80 hover:text-foreground transition-colors uppercase tracking-wide"
            >
              Planos
            </Link>
          </nav>
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <Button variant="ghost" asChild className="hidden sm:inline-flex font-bold">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button className="font-bold shadow-lg h-10 md:h-11 px-4 md:px-6" asChild>
              <Link to="/student/dashboard">Área do Aluno</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {featuredCourse ? (
          <section className="relative w-full h-[90vh] min-h-[700px] flex items-center mb-16 pt-32">
            <div className="absolute inset-0">
              <img
                src={featuredCourse.thumbnail}
                alt={featuredCourse.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
              <div className="max-w-3xl space-y-6 animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs px-3 py-1 border-none shadow-md">
                    Lançamento
                  </Badge>
                  <span className="text-foreground/80 font-bold text-sm uppercase tracking-wider shadow-sm drop-shadow-md">
                    {featuredCourse.area}
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] drop-shadow-lg text-foreground">
                  {featuredCourse.title}
                </h1>
                <p className="text-xl md:text-2xl text-foreground/80 font-medium leading-relaxed max-w-2xl drop-shadow-md line-clamp-3">
                  {featuredCourse.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg font-bold shadow-xl"
                    onClick={() => navigate('/login')}
                  >
                    <Play className="mr-2 size-6 fill-current" /> Assistir Agora
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg font-bold bg-background/50 border-foreground/20 hover:bg-background/80 backdrop-blur-md"
                    onClick={() => navigate('/cursos')}
                  >
                    <Info className="mr-2 size-6" /> Mais Informações
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="h-32" />
        )}

        <div className="space-y-8 md:space-y-12 pb-32 -mt-10 relative z-20">
          <div className="container mx-auto px-4 md:px-8 flex flex-wrap justify-center sm:justify-start gap-4 mb-4">
            <Button
              variant={activeFilter === 'recent' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('recent')}
              className={cn(
                'rounded-full font-bold px-6',
                activeFilter !== 'recent' &&
                  'bg-background/50 border-border hover:bg-muted backdrop-blur-sm shadow-sm',
              )}
            >
              Mais recentes
            </Button>
            <Button
              variant={activeFilter === 'popular' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('popular')}
              className={cn(
                'rounded-full font-bold px-6',
                activeFilter !== 'popular' &&
                  'bg-background/50 border-border hover:bg-muted backdrop-blur-sm shadow-sm',
              )}
            >
              Populares
            </Button>
            <Button
              variant={activeFilter === 'area' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('area')}
              className={cn(
                'rounded-full font-bold px-6',
                activeFilter !== 'area' &&
                  'bg-background/50 border-border hover:bg-muted backdrop-blur-sm shadow-sm',
              )}
            >
              Por área de conhecimento
            </Button>
          </div>

          {renderContent()}
        </div>
      </main>

      <footer className="bg-muted/30 border-t border-border py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <Logo imgClassName="h-12 w-auto opacity-70 grayscale" />
              </div>
              <p className="text-base text-muted-foreground max-w-sm leading-relaxed font-medium">
                Transformando o futuro da educação através de tecnologia, inovação e excelência
                pedagógica.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 tracking-wide uppercase">Plataforma</h4>
              <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
                <li>
                  <Link to="/cursos" className="hover:text-foreground transition-colors">
                    Catálogo de Cursos
                  </Link>
                </li>
                <li>
                  <Link to="/sobre" className="hover:text-foreground transition-colors">
                    Sobre a Academia
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 tracking-wide uppercase">Suporte</h4>
              <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
                <li>
                  <Link to="/contato" className="hover:text-foreground transition-colors">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link to="/planos" className="hover:text-foreground transition-colors">
                    Planos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-bold text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Observatório Academy. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
