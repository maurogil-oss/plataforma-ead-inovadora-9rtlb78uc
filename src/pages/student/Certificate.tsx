import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, ArrowLeft, Award } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useLmsStore } from '@/stores/lmsStore'

export default function Certificate() {
  const { id } = useParams()
  const user = useAuthStore((s) => s.user)
  const { courses } = useLmsStore()

  const course = courses.find((c) => c.id === id) || courses[0]

  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto animate-in fade-in duration-700">
      <Button variant="ghost" asChild className="text-brand">
        <Link to="/student/courses">
          <ArrowLeft className="mr-2 size-4" /> Voltar aos Meus Cursos
        </Link>
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Certificado de Conclusão</h1>
          <p className="text-muted-foreground mt-1">
            Gere ou faça o download do seu documento de certificação.
          </p>
        </div>
        <Button size="lg" className="font-bold shadow-md w-full sm:w-auto">
          <Download className="mr-2 size-5" /> Baixar PDF
        </Button>
      </div>

      <Card className="border-4 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative bg-white dark:bg-slate-900">
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <CardContent className="p-8 sm:p-12 md:p-20 text-center flex flex-col items-center">
          <Award className="size-20 text-blue-600 mb-8" />
          <h2 className="text-lg md:text-xl font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 text-center">
            Certificado de Especialização
          </h2>
          <p className="text-slate-600 mb-6 text-base md:text-lg">Certificamos que</p>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 border-b-2 border-slate-200 pb-4 inline-block px-4 sm:px-10 text-center">
            {user?.name || 'João Aluno'}
          </h3>
          <p className="text-slate-600 mb-4 text-base md:text-lg">
            concluiu com êxito o programa educacional
          </p>
          <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-12 text-center">
            {course.title}
          </h4>
          <div className="flex flex-col sm:flex-row w-full justify-between items-center sm:items-end border-t border-slate-200 pt-8 mt-4 gap-6">
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-slate-500 uppercase">Data de Conclusão</p>
              <p className="font-semibold text-slate-900 dark:text-slate-300 text-lg">
                {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-sm font-bold text-slate-500 uppercase">Código de Validação</p>
              <p className="font-mono font-bold text-slate-900 dark:text-slate-300 text-lg uppercase">
                {Math.random().toString(36).substring(2, 10)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
