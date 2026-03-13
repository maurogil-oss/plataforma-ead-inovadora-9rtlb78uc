import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, Layout, Play } from 'lucide-react'
import logoUrl from '@/assets/logo-academy-2-82c76.png'

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="Observatório Academy (DEMO)"
              className="h-12 w-auto object-contain mix-blend-screen brightness-0 invert opacity-90"
            />
          </div>
          <nav className="hidden md:flex gap-8">
            <Link
              to="/cursos"
              className="text-sm font-semibold text-foreground/80 hover:text-[#176a7e] transition-colors"
            >
              Cursos
            </Link>
            <Link
              to="/sobre"
              className="text-sm font-semibold text-foreground/80 hover:text-[#176a7e] transition-colors"
            >
              Sobre a Academia
            </Link>
            <Link
              to="/planos"
              className="text-sm font-semibold text-foreground/80 hover:text-[#176a7e] transition-colors"
            >
              Planos
            </Link>
            <Link
              to="/contato"
              className="text-sm font-semibold text-foreground/80 hover:text-[#176a7e] transition-colors"
            >
              Contato
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="hidden sm:inline-flex text-foreground font-semibold"
            >
              <Link to="/login">Entrar</Link>
            </Button>
            <Button className="bg-[#176a7e] hover:bg-[#115060] text-white font-semibold" asChild>
              <Link to="/student/dashboard">Área do Aluno</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 overflow-hidden relative bg-background">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="container mx-auto px-4 relative">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1 text-center md:text-left space-y-8">
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-colors border-border bg-background text-[#176a7e] shadow-sm">
                  Novo: Certificados com Validação QR Code
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                  Transforme seu futuro com o{' '}
                  <span className="text-[#176a7e]">Observatório Academy</span>
                </h1>
                <p className="text-xl text-muted-foreground md:max-w-[85%] leading-relaxed">
                  A plataforma EAD definitiva para alavancar sua carreira. Cursos de alta qualidade,
                  metodologia inovadora e certificados amplamente reconhecidos pelo mercado.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-[#176a7e] hover:bg-[#115060] text-white text-base"
                    asChild
                  >
                    <Link to="/cursos">
                      Explorar Cursos <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base border-border hover:bg-muted text-foreground"
                    asChild
                  >
                    <Link to="/sobre">Conheça a Academia</Link>
                  </Button>
                </div>
              </div>
              <div className="flex-1 relative w-full max-w-lg mx-auto md:max-w-none">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#176a7e] to-cyan-300 opacity-20 blur-3xl" />
                <div className="relative rounded-2xl border border-border bg-card p-2 shadow-2xl">
                  <img
                    src="https://img.usecurling.com/p/800/600?q=online%20education&color=blue&dpr=2"
                    alt="Plataforma de ensino Observatório Academy"
                    className="rounded-xl object-cover w-full h-auto border border-border"
                  />
                  <div className="absolute -bottom-8 -left-8 bg-card rounded-2xl p-5 shadow-xl border border-border flex items-center gap-4 animate-fade-in-up">
                    <div className="h-14 w-14 bg-[#176a7e]/10 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-7 w-7 text-[#176a7e]" />
                    </div>
                    <div>
                      <p className="font-extrabold text-2xl text-foreground">+10k</p>
                      <p className="text-sm font-medium text-muted-foreground">Alunos formados</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-foreground">
                Por que escolher o Observatório Academy (DEMO)?
              </h2>
              <p className="text-lg text-muted-foreground">
                Oferecemos a melhor experiência de aprendizado com recursos exclusivos que aceleram
                seu desenvolvimento profissional.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-10 rounded-3xl border border-border transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="h-14 w-14 bg-background shadow-sm rounded-xl border border-border flex items-center justify-center mb-8">
                  <Layout className="h-7 w-7 text-[#176a7e]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">Plataforma Intuitiva</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Interface moderna e extremamente fácil de usar, permitindo que você foque 100% no
                  seu aprendizado, sem distrações desnecessárias.
                </p>
              </div>
              <div className="bg-card p-10 rounded-3xl border border-border transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="h-14 w-14 bg-background shadow-sm rounded-xl border border-border flex items-center justify-center mb-8">
                  <Play className="h-7 w-7 text-[#176a7e]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">Aulas em Alta Qualidade</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Conteúdo em vídeo de altíssima definição, materiais complementares em PDF e
                  exercícios práticos dinâmicos para fixação.
                </p>
              </div>
              <div className="bg-card p-10 rounded-3xl border border-border transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="h-14 w-14 bg-background shadow-sm rounded-xl border border-border flex items-center justify-center mb-8">
                  <CheckCircle2 className="h-7 w-7 text-[#176a7e]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">Certificado Reconhecido</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ao concluir, garanta seus certificados com autenticação por QR Code, amplamente
                  aceitos em todo o território nacional.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src={logoUrl}
                  alt="Observatório Academy"
                  className="h-12 object-contain mix-blend-screen brightness-0 invert opacity-90"
                />
              </div>
              <p className="text-base text-slate-400 max-w-sm leading-relaxed">
                Transformando o futuro da educação através de tecnologia, inovação e excelência
                pedagógica.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Plataforma</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <Link to="/cursos" className="text-slate-400 hover:text-white transition-colors">
                    Catálogo de Cursos
                  </Link>
                </li>
                <li>
                  <Link to="/sobre" className="text-slate-400 hover:text-white transition-colors">
                    Sobre a Academia
                  </Link>
                </li>
                <li>
                  <Link
                    to="/instrutores"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Seja um Instrutor
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Suporte</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <Link to="/ajuda" className="text-slate-400 hover:text-white transition-colors">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link to="/termos" className="text-slate-400 hover:text-white transition-colors">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacidade"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 font-medium">
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
