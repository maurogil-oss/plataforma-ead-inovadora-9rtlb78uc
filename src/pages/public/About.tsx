import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Lightbulb, Users, Target, Shield, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'

export default function About() {
  const pillars = [
    {
      title: 'Conteúdo Imersivo',
      description:
        'Aulas em altíssima qualidade visual, projetadas para manter você engajado do início ao fim, como na sua série favorita.',
      icon: <BookOpen className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Inovação Constante',
      description:
        'As metodologias mais recentes aplicadas ao seu aprendizado através de nossa tecnologia de streaming educacional.',
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Comunidade Ativa',
      description:
        'Plataforma de networking e troca de experiências valiosas com profissionais da área.',
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Foco no Aluno',
      description:
        'Suporte dedicado e acompanhamento do progresso em tempo real para garantir a melhor taxa de conclusão.',
      icon: <Target className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Certificação Segura',
      description:
        'Certificados com validação digital via QR Code, garantindo autenticidade contra fraudes.',
      icon: <Shield className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Excelência',
      description:
        'Instrutores criteriosamente selecionados para entregar a mais alta qualidade educacional do mercado.',
      icon: <Award className="h-6 w-6 text-primary" />,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Logo className="h-12 w-auto transition-transform duration-300 group-hover:scale-105 filter drop-shadow-md" />
          </Link>
          <Button
            variant="ghost"
            asChild
            className="text-white font-bold hover:bg-white/10 hover:text-white"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Início
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 md:py-32 relative overflow-hidden bg-slate-900 border-b border-slate-800">
          <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1200/800?q=cinema&color=blue&dpr=1')] opacity-[0.1] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
          <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
            <Logo className="h-32 md:h-48 mx-auto mb-10 w-auto drop-shadow-2xl transition-transform duration-500 hover:scale-105" />
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 text-white drop-shadow-lg">
              A Revolução do Aprendizado
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-medium">
              O <strong className="font-extrabold text-white">Observatório Academy (DEMO)</strong>{' '}
              traz a experiência fluida e viciante das plataformas de streaming para o universo da
              educação profissional.
            </p>
          </div>
        </section>

        <section className="py-24 bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Pilares da Academia
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg">
                Nossos valores fundamentais que guiam cada recurso construído e cada curso oferecido
                em nossa plataforma.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pillars.map((pillar, i) => (
                <div
                  key={i}
                  className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-lg hover:shadow-2xl hover:border-slate-700 transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="h-14 w-14 bg-slate-800 rounded-xl shadow-inner flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-red-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
            <h2 className="text-4xl font-black mb-6 drop-shadow-md">
              Pronto para maratonar conhecimento?
            </h2>
            <p className="text-white/90 mb-10 text-xl font-medium drop-shadow">
              Junte-se a milhares de alunos que já estão transformando suas carreiras com a
              experiência Observatório Academy (DEMO).
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="font-bold shadow-xl h-14 px-8 text-lg bg-white text-red-600 hover:bg-slate-100"
                asChild
              >
                <Link to="/cursos">Explorar o Catálogo</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-bold h-14 px-8 text-lg backdrop-blur-sm"
                asChild
              >
                <Link to="/login">Criar Conta Grátis</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-slate-950 border-t border-slate-900">
        <div className="container mx-auto px-4 text-center text-slate-500 font-medium">
          <Logo
            className="h-12 w-auto mx-auto mb-6 opacity-30 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
            showText={false}
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
