import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Play, Info, Layers, Clock, PlusCircle, Sparkles } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useLmsStore, Course } from '@/stores/lmsStore'
import { useCommercialStore } from '@/stores/commercialStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const CourseCardRender = ({ course, navigate }: { course: Course; navigate: any }) => (
  <Card
    className="group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 relative h-full flex flex-col cursor-pointer"
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
          <PlusCircle className="mr-2 size-4" /> Ver Detalhes
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
        <span className="border border-slate-500 bg-slate-800/80 px-2 py-0.5 rounded text-[10px] uppercase drop-shadow-sm ml-auto font-bold tracking-wider">
          {course.area}
        </span>
      </div>
    </CardContent>
  </Card>
)

const EbookCardRender = ({ product, navigate }: { product: any; navigate: any }) => (
  <Card
    className="group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 relative h-full flex flex-col cursor-pointer"
    onClick={() => navigate(`/store/product/${product.id}`)}
  >
    <div className="aspect-[3/4] relative overflow-hidden bg-slate-800">
      <img
        src={product.coverImage}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        alt={product.title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      <div className="absolute top-3 right-3 bg-red-600 text-white font-black px-2.5 py-0.5 rounded text-[10px] uppercase tracking-widest shadow-md z-30">
        E-book
      </div>

      <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 hidden sm:block">
        <Button
          size="sm"
          className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold shadow-md"
        >
          <Info className="mr-2 size-4" /> Adquirir Leitura
        </Button>
      </div>
    </div>
    <CardContent className="p-5 flex-1 flex flex-col absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 pt-16 pb-5 pointer-events-none z-10">
      <h3 className="font-bold text-lg leading-tight text-white group-hover:text-primary transition-colors line-clamp-2">
        {product.title}
      </h3>
    </CardContent>
  </Card>
)

const SpeakerCardRender = ({ speaker }: { speaker: any }) => (
  <Card className="group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col items-center text-center p-6">
    <div className="w-32 h-32 rounded-full overflow-hidden mb-5 border-4 border-slate-100 dark:border-slate-800 group-hover:border-primary transition-colors shadow-sm">
      <img
        src={speaker.avatar || `https://img.usecurling.com/ppl/thumbnail?seed=${speaker.id}`}
        className="w-full h-full object-cover"
        alt={speaker.name}
      />
    </div>
    <h3 className="font-extrabold text-xl mb-1 text-slate-900 dark:text-white group-hover:text-primary transition-colors">
      {speaker.name}
    </h3>
    <Badge variant="secondary" className="mb-4 text-[10px] uppercase font-bold">
      Especialista
    </Badge>
    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium line-clamp-3">
      {speaker.bio}
    </p>
  </Card>
)

export default function Index() {
  const { courses } = useLmsStore()
  const { products, speakers } = useCommercialStore()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const ebooks = products.filter((p) => p.type === 'ebook')
  const featuredCourse = courses[0] || null

  return (
    <div className="flex min-h-screen flex-col font-sans overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-background/95 via-background/80 to-transparent backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto px-4 md:px-8 py-3 min-h-[90px] flex items-center justify-between gap-6">
          <Logo
            className="flex shrink-0 z-50 focus-visible:outline-none"
            imgClassName="h-10 md:h-11 w-auto"
          />
          <nav className="hidden lg:flex gap-8 items-center flex-1 justify-center pl-8">
            <Link
              to="/cursos"
              className="text-sm font-bold text-foreground/80 hover:text-foreground transition-colors uppercase tracking-wide"
            >
              Catálogo
            </Link>
            <Link
              to="/forum"
              className="text-sm font-bold text-foreground/80 hover:text-foreground transition-colors uppercase tracking-wide"
            >
              Fórum
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
            {user ? (
              <Button className="font-bold shadow-lg h-10 md:h-11 px-4 md:px-6" asChild>
                <Link to="/student/dashboard">Área do Aluno</Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="hidden sm:inline-flex font-bold h-10 md:h-11"
                >
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button className="font-bold shadow-lg h-10 md:h-11 px-4 md:px-6" asChild>
                  <Link to="/login">Assine Agora</Link>
                </Button>
              </>
            )}
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

        <div className="space-y-16 md:space-y-24 pb-32 -mt-10 relative z-20">
          <section className="container mx-auto px-4 md:px-8">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Palestras & Especialistas
              </h2>
              <p className="text-muted-foreground mt-2 text-lg font-medium">
                Aprenda diretamente com as maiores autoridades do setor.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {speakers.map((speaker) => (
                <SpeakerCardRender key={speaker.id} speaker={speaker} />
              ))}
            </div>
          </section>

          <section className="container mx-auto px-4 md:px-8">
            <div className="mb-8 flex items-end justify-between border-b pb-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand dark:text-white">
                  Cursos em Destaque
                </h2>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                  Trilhas de conhecimento focadas em Segurança e Inteligência Urbana.
                </p>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex font-bold">
                <Link to="/cursos">Ver Todos</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {courses.slice(0, 5).map((course) => (
                <CourseCardRender key={course.id} course={course} navigate={navigate} />
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Button variant="outline" className="w-full font-bold" asChild>
                <Link to="/cursos">Ver Todos os Cursos</Link>
              </Button>
            </div>
          </section>

          <section className="container mx-auto px-4 md:px-8">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Biblioteca Digital (E-books)
              </h2>
              <p className="text-muted-foreground mt-2 text-lg font-medium">
                Materiais ricos e manuais práticos disponíveis para leitura.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {ebooks.map((ebook) => (
                <EbookCardRender key={ebook.id} product={ebook} navigate={navigate} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-muted/30 border-t border-border py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <Logo imgClassName="h-10 w-auto opacity-70 grayscale" />
              </div>
              <p className="text-base text-muted-foreground max-w-sm leading-relaxed font-medium">
                Transformando o futuro da mobilidade e segurança urbana através de educação e
                inovação.
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
                  <Link to="/forum" className="hover:text-foreground transition-colors">
                    Fórum da Comunidade
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 tracking-wide uppercase">Institucional</h4>
              <ul className="space-y-4 text-sm font-semibold text-muted-foreground">
                <li>
                  <Link to="/sobre" className="hover:text-foreground transition-colors">
                    Sobre a Academia
                  </Link>
                </li>
                <li>
                  <Link to="/contato" className="hover:text-foreground transition-colors">
                    Fale Conosco
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
