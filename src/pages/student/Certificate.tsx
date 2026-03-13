import { useParams, Link } from 'react-router-dom'
import { useLmsStore } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer } from 'lucide-react'

export default function Certificate() {
  const { id } = useParams()
  const user = useAuthStore((s) => s.user)
  const course = useLmsStore((s) => s.courses.find((c) => c.id === id))

  if (!course || !user) return <div>Documento Inválido</div>

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <Button asChild variant="ghost">
          <Link to={`/student/course/${id}`}>
            <ArrowLeft className="mr-2 size-4" /> Voltar ao Curso
          </Link>
        </Button>
        <Button onClick={() => window.print()} variant="outline">
          <Printer className="mr-2 size-4" /> Imprimir
        </Button>
      </div>

      <Card className="border-[12px] border-double border-primary/20 aspect-[1.414/1] bg-white text-slate-900 flex items-center justify-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/800/600?q=pattern&color=gray')] opacity-[0.03]" />

        <div className="absolute top-12 left-12 right-12 bottom-12 border-2 border-primary/10" />

        <CardContent className="text-center space-y-8 relative z-10 p-16 max-w-4xl">
          <div className="w-24 h-24 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-8 shadow-lg">
            <AwardIcon className="size-12" />
          </div>

          <h1 className="text-5xl md:text-6xl font-serif text-primary tracking-tight">
            Certificado de Conclusão
          </h1>

          <p className="text-2xl text-slate-600 font-light mt-12">Certificamos que</p>

          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wide border-b border-primary/20 pb-4 inline-block px-12">
            {user.name}
          </h2>

          <p className="text-xl text-slate-600 font-light mt-8">concluiu com êxito o curso de</p>

          <h3 className="text-3xl md:text-4xl font-semibold text-primary">{course.title}</h3>

          <div className="flex justify-between items-end mt-24 text-slate-500 font-medium px-12 pt-12">
            <div className="text-left">
              <div className="w-48 border-b border-slate-400 mb-2"></div>
              <p>Assinatura do Gestor</p>
            </div>
            <div className="text-right">
              <p>Data de Conclusão</p>
              <p className="text-lg text-slate-800">{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AwardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  )
}
