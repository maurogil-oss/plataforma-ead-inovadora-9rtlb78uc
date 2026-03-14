import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, GraduationCap, Layout, Play } from 'lucide-react'
import { Logo } from '@/components/Logo'

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="h-12 w-auto" />
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link
              to="/cursos"
              className="text-sm font-bold text-brand hover:text-primary transition-colors uppercase tracking-wide"
            >
              Cursos
            </Link>
            <Link
              to="/sobre"
              className="text-sm font-bold text-brand hover:text-primary transition-colors uppercase tracking-wide"
            >
              Sobre a Academia
            </Link>
            <Link
              to="/planos"
              className="text-sm font-bold text-brand hover:text-primary transition-colors uppercase tracking-wide"
            >
              Planos
            </Link>
            <Link
              to="/contato"
              className="text-sm font-bold text-brand hover:text-primary transition-colors uppercase tracking-wide"
            >
              Contato
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="hidden sm:inline-flex text-brand font-bold hover:text-primary hover:bg-primary/10"
            >
              <Link to="/login">Entrar</Link>
            </Button>
            <Button className="font-bold shadow-md" asChild>
              <Link to="/student/dashboard">Área do Aluno</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 overflow-hidden relative bg-slate-50">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f2a4a0a_1px,transparent_1px),linear-gradient(to_bottom,#0f2a4a0a_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="container mx-auto px-4 relative">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1 text-center md:text-left space-y-8">
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold border-primary/20 bg-primary/5 text-primary shadow-sm uppercase tracking-wider">
                  Novo: Certificados com Validação QR Code
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand leading-[1.1]">
                  Transforme seu futuro com o{' '}
                  <span className="text-primary">Observatório Academy</span>
                </h1>
                <p className="text-xl text-slate-600 md:max-w-[85%] leading-relaxed font-medium">
                  A plataforma EAD definitiva para alavancar sua carreira. Cursos de alta qualidade,
                  metodologia inovadora e certificados amplamente reconhecidos pelo mercado.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button size="lg" className="h-14 px-8 text-base font-bold shadow-lg" asChild>
                    <Link to="/cursos">
                      Explorar Cursos <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base font-bold border-brand text-brand hover:bg-brand hover:text-white"
                    asChild
                  >
                    <Link to="/sobre">Conheça a Academia</Link>
                  </Button>
                </div>
              </div>
              <div className="flex-1 relative w-full max-w-lg mx-auto md:max-w-none">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand to-primary opacity-20 blur-3xl" />
                <div className="relative rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                  <img
                    src="https://img.usecurling.com/p/800/600?q=online%20education&color=blue&dpr=2"
                    alt="Plataforma de ensino Observatório Academy"
                    className="rounded-xl object-cover w-full h-auto"
                  />
                  <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-5 shadow-xl border border-slate-100 flex items-center gap-4 animate-fade-in-up">
                    <div className="h-14 w-14 bg-brand/10 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-7 w-7 text-brand" />
                    </div>
                    <div>
                      <p className="font-extrabold text-2xl text-brand">+10k</p>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                        Alunos formados
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-brand">
                Por que escolher o Observatório Academy (DEMO)?
              </h2>
              <p className="text-lg text-slate-600 font-medium">
                Oferecemos a melhor experiência de aprendizado com recursos exclusivos que aceleram
                seu desenvolvimento profissional.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 group">
                <div className="h-14 w-14 bg-white shadow-sm rounded-xl border border-slate-200 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:border-primary transition-colors">
                  <Layout className="h-7 w-7 text-brand group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-brand">Plataforma Intuitiva</h3>
                <p className="text-slate-600 leading-relaxed">
                  Interface moderna e extremamente fácil de usar, permitindo que você foque 100% no
                  seu aprendizado, sem distrações desnecessárias.
                </p>
              </div>
              <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 group">
                <div className="h-14 w-14 bg-white shadow-sm rounded-xl border border-slate-200 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:border-primary transition-colors">
                  <Play className="h-7 w-7 text-brand group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-brand">Aulas em Alta Qualidade</h3>
                <p className="text-slate-600 leading-relaxed">
                  Conteúdo em vídeo de altíssima definição, materiais complementares em PDF e
                  exercícios práticos dinâmicos para fixação.
                </p>
              </div>
              <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 group">
                <div className="h-14 w-14 bg-white shadow-sm rounded-xl border border-slate-200 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:border-primary transition-colors">
                  <CheckCircle2 className="h-7 w-7 text-brand group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-brand">Certificado Reconhecido</h3>
                <p className="text-slate-600 leading-relaxed">
                  Ao concluir, garanta seus certificados com autenticação por QR Code, amplamente
                  aceitos em todo o território nacional.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand text-brand-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <Logo className="h-12 w-auto" />
              </div>
              <p className="text-base text-brand-foreground/70 max-w-sm leading-relaxed font-medium">
                Transformando o futuro da educação através de tecnologia, inovação e excelência
                pedagógica.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase">Plataforma</h4>
              <ul className="space-y-4 text-sm font-semibold">
                <li>
                  <Link
                    to="/cursos"
                    className="text-brand-foreground/70 hover:text-primary transition-colors"
                  >
                    Catálogo de Cursos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sobre"
                    className="text-brand-foreground/70 hover:text-primary transition-colors"
                  >
                    Sobre a Academia
                  </Link>
                </li>
                <li>
                  <Link
                    to="/instrutores"
                    className="text-brand-foreground/70 hover:text-primary transition-colors"
                  >
                    Seja um Instrutor
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase">Suporte</h4>
              <ul className="space-y-4 text-sm font-semibold">
                <li>
                  <Link
                    to="/ajuda"
                    className="text-brand-foreground/70 hover:text-primary transition-colors"
                  >
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link
                    to="/termos"
                    className="text-brand-foreground/70 hover:text-primary transition-colors"
                  >
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacidade"
                    className="text-brand-foreground/70 hover:text-primary transition-colors"
                  >
                    Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-brand-foreground/50 font-bold">
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
