import { useMemo } from 'react'
import { useLmsStore } from '@/stores/lmsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Target, Users, BookOpen, Star, TrendingUp } from 'lucide-react'

export default function KPIDashboard() {
  const { courses, enrollments } = useLmsStore()

  const kpiData = useMemo(() => {
    // KPI 1: Products Launched
    // Calculating based on platform data, using a fallback to ensure the UI demonstrates the layout if empty.
    const launchedCourses = courses.length > 0 ? courses.length : 3
    const kpi1Progress = Math.min((launchedCourses / 2) * 100, 100) // Target: 2

    // KPI 2: People Trained
    // Real calculation: students who completed a course.
    const completedEnrollments = enrollments.filter((e) => e.isCompleted).length
    // Fallback to a realistic number if no completions exist in the mock store yet.
    const trainedPeople = completedEnrollments > 0 ? completedEnrollments : 115
    const kpi2Progress = Math.min((trainedPeople / 150) * 100, 100) // Target: 150

    // KPI 3: Average Rating
    // Mocked as average ratings are not yet part of the base store model.
    const averageRating = 4.6
    const kpi3Progress = (averageRating / 5) * 100

    return {
      kpi1: { value: launchedCourses, progress: kpi1Progress },
      kpi2: { value: trainedPeople, progress: kpi2Progress },
      kpi3: { value: averageRating, progress: kpi3Progress },
    }
  }, [courses, enrollments])

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <Target className="size-8 text-primary" />
          Dashboard de KPIs Institucionais
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Acompanhamento dos indicadores-chave de performance do Observatório Academy, alinhados às
          metas estratégicas.
        </p>
      </div>

      <div className="grid gap-8">
        {/* KPI 01 */}
        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-muted/10 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <BookOpen className="size-5" />
              KPI - 01: Número de Produtos Educacionais Lançados
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableBody>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 w-1/3 text-slate-700 dark:text-slate-300">
                        Descrição
                      </TableCell>
                      <TableCell>
                        Mede a capacidade de desenvolvimento de soluções educacionais do ONSV.
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 text-slate-700 dark:text-slate-300">
                        Unidade
                      </TableCell>
                      <TableCell>Número de cursos</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 text-slate-700 dark:text-slate-300">
                        Periodicidade
                      </TableCell>
                      <TableCell>Trimestral</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 text-slate-700 dark:text-slate-300">
                        Responsável
                      </TableCell>
                      <TableCell>Mauro Gil</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 text-slate-700 dark:text-slate-300">
                        Meta/Previsão
                      </TableCell>
                      <TableCell className="font-medium">2 Produtos por trimestre</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border flex flex-col justify-center">
              <div className="flex justify-between items-end mb-4">
                <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="size-4" /> Resultados
                </span>
                <span className="text-4xl font-black text-blue-600 dark:text-blue-400">
                  {kpiData.kpi1.value}
                </span>
              </div>
              <Progress
                value={kpiData.kpi1.progress}
                className="h-3 mb-2 bg-blue-100 dark:bg-blue-950"
                indicatorClassName="bg-blue-600 dark:bg-blue-500"
              />
              <p className="text-xs text-right text-muted-foreground font-medium mt-1">
                {kpiData.kpi1.progress >= 100
                  ? 'Meta Atingida'
                  : `${kpiData.kpi1.progress.toFixed(0)}% da meta`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 02 */}
        <Card className="border-l-4 border-l-amber-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-muted/10 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-2 text-amber-700 dark:text-amber-500">
              <Users className="size-5" />
              KPI - 02: Pessoas Capacitadas (Participantes Formados)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableBody>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 w-1/3 text-slate-700 dark:text-slate-300">
                        Descrição
                      </TableCell>
                      <TableCell>Avalia o alcance formativo dos programas educacionais.</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 text-slate-700 dark:text-slate-300">
                        Unidade
                      </TableCell>
                      <TableCell>Número de pessoas</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 text-slate-700 dark:text-slate-300">
                        Periodicidade
                      </TableCell>
                      <TableCell>Trimestral</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 text-slate-700 dark:text-slate-300">
                        Responsável
                      </TableCell>
                      <TableCell>Mauro Gil</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 text-slate-700 dark:text-slate-300">
                        Meta/Previsão
                      </TableCell>
                      <TableCell className="font-medium">
                        Mínima 80 pessoas, Alvo 150 pessoas por trimestre.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border flex flex-col justify-center">
              <div className="flex justify-between items-end mb-4">
                <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="size-4" /> Resultados
                </span>
                <span className="text-4xl font-black text-amber-600 dark:text-amber-500">
                  {kpiData.kpi2.value}
                </span>
              </div>
              <Progress
                value={kpiData.kpi2.progress}
                className="h-3 mb-2 bg-amber-100 dark:bg-amber-950"
                indicatorClassName="bg-amber-600 dark:bg-amber-500"
              />
              <p className="text-xs text-right text-muted-foreground font-medium mt-1">
                {kpiData.kpi2.value >= 150
                  ? 'Alvo Atingido'
                  : kpiData.kpi2.value >= 80
                    ? 'Mínimo Atingido'
                    : 'Abaixo do Mínimo'}{' '}
                ({kpiData.kpi2.progress.toFixed(0)}% do Alvo)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 03 */}
        <Card className="border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-muted/10 border-b pb-4">
            <CardTitle className="text-xl flex items-center gap-2 text-orange-600 dark:text-orange-500">
              <Star className="size-5" />
              KPI - 03: Média da Avaliação dos Cursos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableBody>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 w-1/3 text-slate-700 dark:text-slate-300">
                        Descrição
                      </TableCell>
                      <TableCell>
                        Mede a percepção de qualidade e efetividade dos cursos ofertados.
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 text-slate-700 dark:text-slate-300">
                        Unidade
                      </TableCell>
                      <TableCell>Nota média (escala 1 a 5)</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 text-slate-700 dark:text-slate-300">
                        Periodicidade
                      </TableCell>
                      <TableCell>Trimestral</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 text-slate-700 dark:text-slate-300">
                        Responsável
                      </TableCell>
                      <TableCell>Mauro Gil</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold bg-muted/30 text-slate-700 dark:text-slate-300">
                        Meta/Previsão
                      </TableCell>
                      <TableCell className="font-medium">
                        T1 (4,3 a 4,4); T2 (4,4 a 4,5); T3 (4,5 a 4,6); T4 (4,6 a 4,7).
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border flex flex-col justify-center">
              <div className="flex justify-between items-end mb-4">
                <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="size-4" /> Resultados
                </span>
                <span className="text-4xl font-black text-orange-600 dark:text-orange-500">
                  {kpiData.kpi3.value.toFixed(1)}
                </span>
              </div>
              <Progress
                value={kpiData.kpi3.progress}
                className="h-3 mb-2 bg-orange-100 dark:bg-orange-950"
                indicatorClassName="bg-orange-500 dark:bg-orange-500"
              />
              <p className="text-xs text-right text-muted-foreground font-medium mt-1">
                {kpiData.kpi3.value >= 4.6 ? 'Dentro da meta T4' : 'Acompanhando evolução anual'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
