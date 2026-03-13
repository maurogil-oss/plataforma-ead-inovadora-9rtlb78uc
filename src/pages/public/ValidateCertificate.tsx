import { useParams, Link } from 'react-router-dom'
import { useLmsStore } from '@/stores/lmsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, ShieldCheck, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ValidateCertificate() {
  const { code } = useParams()
  const { enrollments, students, courses } = useLmsStore()

  let isValid = false
  let studentName = ''
  let courseTitle = ''
  let completionDate = ''
  let errorMsg = ''

  try {
    if (!code) throw new Error('Código ausente.')
    const decoded = atob(code)
    const [studentId, courseId] = decoded.split('-')

    if (!studentId || !courseId) throw new Error('Formato inválido.')

    const enrollment = enrollments.find((e) => e.studentId === studentId && e.courseId === courseId)
    if (!enrollment || !enrollment.isCompleted)
      throw new Error('Certificado não encontrado ou curso não concluído.')

    const student = students.find((s) => s.id === studentId)
    const course = courses.find((c) => c.id === courseId)

    if (!student || !course) throw new Error('Dados do aluno ou curso não encontrados.')

    isValid = true
    studentName = student.name
    courseTitle = course.title
    completionDate = enrollment.completionDate || new Date().toISOString()
  } catch (e: any) {
    errorMsg = e.message || 'Código de validação inválido.'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2 mb-8">
          <ShieldCheck className="mx-auto size-12 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Portal de Autenticidade</h1>
          <p className="text-muted-foreground">Verificação de certificados e diplomas emitidos.</p>
        </div>

        <Card className="border-t-4 border-t-primary shadow-xl overflow-hidden">
          {isValid ? (
            <div className="bg-success/5 border-b border-success/20 p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="bg-success text-success-foreground p-3 rounded-full mb-2 shadow-sm">
                <CheckCircle className="size-8" />
              </div>
              <h2 className="text-2xl font-bold text-success-foreground uppercase tracking-wide">
                Certificado Válido
              </h2>
              <p className="text-success-foreground/80 font-medium">
                Este documento é autêntico e foi emitido pela nossa instituição.
              </p>
            </div>
          ) : (
            <div className="bg-destructive/5 border-b border-destructive/20 p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="bg-destructive text-destructive-foreground p-3 rounded-full mb-2 shadow-sm">
                <XCircle className="size-8" />
              </div>
              <h2 className="text-2xl font-bold text-destructive-foreground uppercase tracking-wide">
                Documento Inválido
              </h2>
              <p className="text-destructive-foreground/80 font-medium">{errorMsg}</p>
            </div>
          )}

          <CardContent className="p-8 space-y-6">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Código de Verificação
              </p>
              <p className="font-mono text-sm bg-muted p-2 rounded break-all">{code}</p>
            </div>

            {isValid && (
              <div className="space-y-5 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nome do Aluno(a)</p>
                  <p className="text-xl font-bold">{studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Curso Concluído</p>
                  <p className="text-lg font-medium">{courseTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Data de Conclusão</p>
                  <p className="text-base font-medium">
                    {new Date(completionDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center pt-8">
          <Button variant="ghost" asChild>
            <Link to="/">
              <Home className="mr-2 size-4" /> Voltar ao Início
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
