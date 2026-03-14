import { PublicHeader } from '@/components/PublicHeader'

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col animate-in fade-in duration-1000">
      <PublicHeader />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-white tracking-tight text-center">
          Sobre a Academia
        </h1>
        <div className="prose prose-invert prose-lg mx-auto text-slate-300">
          <p className="text-center font-medium leading-relaxed mb-10">
            O Observatório Academy é o braço educacional dedicado a transformar a segurança viária e
            mobilidade urbana no Brasil. Nossa missão é capacitar profissionais, gestores públicos e
            sociedade com conhecimento técnico de excelência.
          </p>
          <img
            src="https://img.usecurling.com/p/800/400?q=teamwork&color=blue"
            alt="Equipe"
            className="w-full rounded-2xl shadow-xl my-10 object-cover border border-slate-800"
          />
          <h2 className="text-2xl font-bold text-white mb-4">Nossa Visão</h2>
          <p className="leading-relaxed">
            Ser a principal referência na qualificação de especialistas em trânsito e cidades
            inteligentes, promovendo a Visão Zero e o ecossistema de mobilidade sustentável.
            Trabalhamos em conjunto com especialistas do setor para garantir que nosso material
            reflita as mais recentes normas e inovações globais.
          </p>
        </div>
      </main>
    </div>
  )
}
