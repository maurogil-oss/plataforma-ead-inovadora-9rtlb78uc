import { Link } from 'react-router-dom'
import { PublicHeader } from '@/components/PublicHeader'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tag } from 'lucide-react'

const MOCK_COURSES = [
  {
    id: 1,
    title: 'Design de Interfaces (UI/UX)',
    desc: 'Aprenda a criar interfaces incríveis e focadas no usuário utilizando o Figma.',
    cat: 'Design',
    price: 197.0,
    img: 'https://img.usecurling.com/p/600/400?q=ui%20design&color=blue',
  },
  {
    id: 2,
    title: 'Desenvolvimento Web com ReactJS',
    desc: 'Domine a biblioteca mais popular do mercado e construa aplicações modernas.',
    cat: 'Tecnologia',
    price: 297.0,
    img: 'https://img.usecurling.com/p/600/400?q=code&color=purple',
  },
  {
    id: 3,
    title: 'Marketing Digital e Growth Hacking',
    desc: 'Estratégias avançadas para alavancar vendas e engajamento em múltiplos canais.',
    cat: 'Marketing',
    price: 147.0,
    img: 'https://img.usecurling.com/p/600/400?q=marketing&color=orange',
  },
  {
    id: 4,
    title: 'Gestão Ágil com Scrum e Kanban',
    desc: 'Lidere equipes de alta performance com metodologias ágeis reconhecidas pelo mercado.',
    cat: 'Negócios',
    price: 247.0,
    img: 'https://img.usecurling.com/p/600/400?q=agile&color=green',
  },
  {
    id: 5,
    title: 'Data Science para Iniciantes',
    desc: 'Introdução prática à análise de dados, Python e Machine Learning com projetos reais.',
    cat: 'Tecnologia',
    price: 397.0,
    img: 'https://img.usecurling.com/p/600/400?q=data&color=cyan',
  },
  {
    id: 6,
    title: 'Liderança e Comunicação Assertiva',
    desc: 'Desenvolva soft skills essenciais para assumir cargos de liderança no mercado atual.',
    cat: 'Carreira',
    price: 197.0,
    img: 'https://img.usecurling.com/p/600/400?q=leadership&color=gray',
  },
]

export default function Courses() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground tracking-tight">
            Catálogo de Cursos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore nossos cursos de alta qualidade e acelere sua carreira profissional com a melhor
            metodologia do mercado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_COURSES.map((c) => (
            <Card
              key={c.id}
              className="overflow-hidden flex flex-col hover:shadow-lg transition-all hover:-translate-y-1 border-border bg-card"
            >
              <div className="relative h-48 bg-muted">
                <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                <Badge className="absolute top-3 left-3 bg-background/95 text-foreground hover:bg-background border-none shadow-sm backdrop-blur-sm font-semibold">
                  {c.cat}
                </Badge>
                <div className="absolute bottom-3 right-3 bg-[#176a7e] text-white font-bold px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1.5 text-sm">
                  <Tag className="size-4" /> R$ {c.price.toFixed(2)}
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-xl leading-tight text-foreground">
                  {c.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground line-clamp-3 leading-relaxed">{c.desc}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  className="w-full bg-[#176a7e] hover:bg-[#115060] text-white font-semibold"
                  asChild
                >
                  <Link to="/login">Garantir Vaga</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
