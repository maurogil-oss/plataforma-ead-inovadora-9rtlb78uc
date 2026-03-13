import { useParams, Link } from 'react-router-dom'
import { useLmsStore } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, ExternalLink } from 'lucide-react'

// Simple purely visual deterministic "QR" matrix for prototype without external APIs
const FakeQRSVG = ({ code }: { code: string }) => {
  let seed = 1
  for (let i = 0; i < code.length; i++) seed = (seed * 31 + code.charCodeAt(i)) % 10000
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  const rects = []
  rects.push(
    <path
      key="c"
      d="M0,0 h7 v7 h-7 z M1,1 h5 v5 h-5 z M2,2 h3 v3 h-3 z M14,0 h7 v7 h-7 z M15,1 h5 v5 h-5 z M16,2 h3 v3 h-3 z M0,14 h7 v7 h-7 z M1,15 h5 v5 h-5 z M2,16 h3 v3 h-3 z"
      fill="currentColor"
    />,
  )

  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      if ((x < 8 && y < 8) || (x > 13 && y < 8) || (x < 8 && y > 13)) continue
      if (random() > 0.5)
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />)
    }
  }

  return (
    <svg
      viewBox="-2 -2 25 25"
      className="w-full h-full text-black bg-white"
      shapeRendering="crispEdges"
    >
      {rects}
    </svg>
  )
}

export default function Certificate() {
  const { id } = useParams()
  const user = useAuthStore((s) => s.user)
  const store = useLmsStore()

  const course = store.courses.find((c) => c.id === id)
  const enrollment = store.enrollments.find((e) => e.courseId === id && e.studentId === user?.id)

  if (!course || !user || !enrollment?.isCompleted)
    return <div>Documento Inválido ou Curso Incompleto</div>

  const rawCode = `${user.id}-${course.id}`
  const validationCode = btoa(rawCode)
  const validationUrl = `${window.location.origin}/validate/${validationCode}`

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-center print:hidden">
        <Button asChild variant="ghost">
          <Link to={`/student/course/${id}`}>
            <ArrowLeft className="mr-2 size-4" /> Voltar ao Curso
          </Link>
        </Button>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link to={`/validate/${validationCode}`} target="_blank">
              <ExternalLink className="mr-2 size-4" /> Validar Online
            </Link>
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="mr-2 size-4" /> Imprimir Documento
          </Button>
        </div>
      </div>

      <Card className="border-[12px] border-double border-primary/20 aspect-[1.414/1] bg-white text-slate-900 flex items-center justify-center relative overflow-hidden shadow-2xl print:shadow-none print:border-none">
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/800/600?q=pattern&color=gray')] opacity-[0.03]" />
        <div className="absolute top-12 left-12 right-12 bottom-12 border-2 border-primary/10" />

        <CardContent className="text-center space-y-8 relative z-10 p-16 max-w-4xl w-full">
          <div className="w-24 h-24 mx-auto bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-8 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
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
          </div>

          <h1 className="text-5xl md:text-6xl font-serif text-primary tracking-tight">
            Certificado de Conclusão
          </h1>
          <p className="text-2xl text-slate-600 font-light mt-12">Certificamos que</p>
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wide border-b border-primary/20 pb-4 inline-block px-12">
            {user.name}
          </h2>
          <p className="text-xl text-slate-600 font-light mt-8">
            concluiu com êxito os requisitos do curso de
          </p>
          <h3 className="text-3xl md:text-4xl font-semibold text-primary">{course.title}</h3>

          <div className="flex justify-between items-end mt-24 text-slate-500 font-medium px-12 pt-12 relative">
            <div className="text-left w-1/3">
              <div className="w-48 border-b border-slate-400 mb-2"></div>
              <p>Diretoria de Ensino</p>
            </div>

            {/* Authenticity Section with QR */}
            <div className="flex flex-col items-center justify-center space-y-2 w-1/3 text-xs">
              <div className="w-24 h-24 border p-1 bg-white shadow-sm">
                <FakeQRSVG code={validationCode} />
              </div>
              <p className="uppercase tracking-widest text-slate-400 mt-2 font-semibold">
                Autenticidade
              </p>
              <p className="font-mono text-slate-600 text-[10px] bg-slate-100 px-2 py-0.5 rounded break-all">
                {validationCode.substring(0, 20)}...
              </p>
            </div>

            <div className="text-right w-1/3">
              <p>Data de Emissão</p>
              <p className="text-lg text-slate-800">
                {new Date(enrollment.completionDate || Date.now()).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
