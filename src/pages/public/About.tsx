import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Lightbulb, Users, Target, Shield, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import logoUrl from '@/assets/logo-academy-2-82c76.png'

export default function About() {
  const pillars = [
    {
      title: 'Conhecimento Prático',
      description:
        'Conteúdos elaborados e focados no que realmente importa para a sua evolução no mercado de trabalho.',
      icon: <BookOpen className="h-6 w-6 text-[#176a7e]" />,
    },
    {
      title: 'Inovação Constante',
      description:
        'As metodologias mais recentes aplicadas ao seu aprendizado através de nossa tecnologia.',
      icon: <Lightbulb className="h-6 w-6 text-[#176a7e]" />,
    },
    {
      title: 'Comunidade Ativa',
      description:
        'Plataforma de networking e troca de experiências valiosas com profissionais da área.',
      icon: <Users className="h-6 w-6 text-[#176a7e]" />,
    },
    {
      title: 'Foco no Aluno',
      description:
        'Suporte dedicado e acompanhamento do progresso para garantir a melhor taxa de conclusão.',
      icon: <Target className="h-6 w-6 text-[#176a7e]" />,
    },
    {
      title: 'Certificação Segura',
      description:
        'Certificados com validação digital via QR Code, garantindo autenticidade contra fraudes.',
      icon: <Shield className="h-6 w-6 text-[#176a7e]" />,
    },
    {
      title: 'Excelência',
      description:
        'Instrutores criteriosamente selecionados para entregar a mais alta qualidade educacional.',
      icon: <Award className="h-6 w-6 text-[#176a7e]" />,
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logoUrl}
              alt="Observatório Academy"
              className="h-10 w-auto object-contain mix-blend-screen invert opacity-95 transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Início
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1200/800?q=education&color=gray&dpr=1')] opacity-5 bg-cover bg-center" />
          <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
            <img
              src={logoUrl}
              alt="Logo Observatório Academy"
              className="h-28 mx-auto mb-10 w-auto object-contain mix-blend-multiply drop-shadow-sm transition-transform duration-500 hover:scale-105"
            />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-slate-900">
              Sobre o Observatório Academy
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              O{' '}
              <strong className="font-semibold text-slate-900">Observatório Academy (DEMO)</strong>{' '}
              é muito mais do que uma plataforma de ensino. Somos um ecossistema dedicado a
              transformar o futuro do aprendizado online, conectando instrutores apaixonados a
              alunos em busca de excelência contínua.
            </p>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="py-24 bg-white border-t">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Pilares da Academia</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Nossos valores fundamentais que guiam cada recurso construído e cada curso oferecido
                em nossa plataforma.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pillars.map((pillar, i) => (
                <div
                  key={i}
                  className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
                >
                  <div className="h-14 w-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-[#176a7e]/10 transition-colors">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="py-20 bg-[#176a7e] text-white">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Pronto para iniciar sua jornada?</h2>
            <p className="text-cyan-100 mb-8 text-lg">
              Junte-se a milhares de alunos que já estão transformando suas carreiras com o
              Observatório Academy (DEMO).
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#176a7e] hover:bg-slate-100" asChild>
                <Link to="/cursos">Explorar Cursos</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-[#115060]"
                asChild
              >
                <Link to="/register">Criar Conta Grátis</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 bg-slate-900">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <img
            src={logoUrl}
            alt="Logo"
            className="h-8 w-auto mx-auto mb-6 object-contain mix-blend-screen invert opacity-50 hover:opacity-100 transition-opacity"
          />
          <p>
            &copy; {new Date().getFullYear()} Observatório Academy (DEMO). Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
