import { useState } from 'react'
import { downloadCSV, printPDF } from '@/lib/export'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Download,
  Users,
  BookOpen,
  Activity,
  FileText,
  File,
  BarChart3,
  CalendarClock,
  Webhook,
} from 'lucide-react'
import { toast } from 'sonner'
import { useReportsData } from '@/hooks/useReportsData'

import ComparativeDashboard from './reports/ComparativeDashboard'
import ReportScheduling from './reports/ReportScheduling'
import BiIntegrations from './reports/BiIntegrations'

export default function Reports() {
  const { courseFilter, setCourseFilter, studentReports, courseReports, activityReports, courses } =
    useReportsData()
  const [activeTab, setActiveTab] = useState('comparative')

  const handleExport = async (format: 'csv' | 'pdf') => {
    toast.info('Preparando exportação...', { id: 'export-toast' })
    await new Promise((r) => setTimeout(r, 600))

    try {
      let headers: string[] = []
      let rows: any[][] = []
      let title = ''

      if (activeTab === 'students') {
        title = 'Relatório de Desempenho por Aluno'
        headers = ['Identificação', 'E-mail', 'Cursos Matriculados', 'Progresso Médio (%)']
        rows = studentReports.map((s) => [
          s.name || '-',
          s.email || '-',
          s.courseCount,
          s.avgProgress,
        ])
      } else if (activeTab === 'courses') {
        title = 'Relatório de Desempenho por Curso'
        headers = ['Nome do Curso', 'Total de Alunos', 'Concluíram', 'Conclusão Média (%)']
        rows = courseReports.map((c) => [c.title, c.studentsCount, c.completedCount, c.avgProgress])
      } else if (activeTab === 'activity') {
        title = 'Relatório de Atividades'
        headers = ['Data / Hora', 'Aluno', 'Curso', 'Atividade Realizada', 'Detalhes']
        rows = activityReports.map((act) => [
          new Date(act.date).toLocaleString('pt-BR'),
          act.student?.name || '-',
          act.course?.title || '-',
          act.type.replace('_', ' ').toUpperCase(),
          act.details || '-',
        ])
      } else {
        toast.error('Apenas as abas de dados tabulares suportam exportação direta no momento.', {
          id: 'export-toast',
        })
        return
      }

      if (format === 'csv') downloadCSV(`relatorio_${activeTab}_${Date.now()}`, headers, rows)
      else printPDF(title, headers, rows)

      toast.success('Relatório exportado com sucesso!', { id: 'export-toast' })
    } catch (error) {
      toast.error('Erro ao exportar dados.', { id: 'export-toast' })
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand">Dashboard de Relatórios</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o engajamento, programe envios automáticos e gerencie integrações.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-brand text-brand font-bold shadow-sm">
              <Download className="mr-2 size-4" /> Exportar Dados
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem
              onClick={() => handleExport('csv')}
              className="font-medium cursor-pointer"
            >
              <FileText className="mr-2 size-4 text-brand" /> Exportar como CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExport('pdf')}
              className="font-medium cursor-pointer"
            >
              <File className="mr-2 size-4 text-primary" /> Exportar como PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap w-full h-auto gap-2 bg-transparent mb-6 justify-start">
          <TabsTrigger
            value="comparative"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-white shadow-sm py-2.5 font-bold tracking-wide"
          >
            <BarChart3 className="mr-2 size-4" /> Visão Comparativa
          </TabsTrigger>
          <TabsTrigger
            value="students"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-white shadow-sm py-2.5 font-bold tracking-wide"
          >
            <Users className="mr-2 size-4" /> Por Aluno
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-white shadow-sm py-2.5 font-bold tracking-wide"
          >
            <BookOpen className="mr-2 size-4" /> Por Curso
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-white shadow-sm py-2.5 font-bold tracking-wide"
          >
            <Activity className="mr-2 size-4" /> Atividades
          </TabsTrigger>
          <TabsTrigger
            value="scheduling"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-white shadow-sm py-2.5 font-bold tracking-wide"
          >
            <CalendarClock className="mr-2 size-4" /> Agendamentos
          </TabsTrigger>
          <TabsTrigger
            value="bi-integration"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-white shadow-sm py-2.5 font-bold tracking-wide"
          >
            <Webhook className="mr-2 size-4" /> Integração BI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comparative" className="mt-0 outline-none">
          <ComparativeDashboard />
        </TabsContent>

        <TabsContent value="scheduling" className="mt-0 outline-none">
          <ReportScheduling />
        </TabsContent>

        <TabsContent value="bi-integration" className="mt-0 outline-none">
          <BiIntegrations />
        </TabsContent>

        {['students', 'courses', 'activity'].includes(activeTab) && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center gap-4 shadow-sm mb-6">
            <label className="text-sm font-bold text-brand shrink-0">Filtrar por Curso:</label>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full md:max-w-md bg-white">
                <SelectValue placeholder="Todos os cursos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Cursos</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <TabsContent value="students" className="mt-0 outline-none">
          <Card className="border-slate-200 shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold text-brand">Identificação do Aluno</TableHead>
                  <TableHead className="text-center font-bold text-brand">
                    Cursos Matriculados
                  </TableHead>
                  <TableHead className="font-bold text-brand w-[30%]">Progresso Médio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentReports.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="font-bold text-slate-800">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{s.courseCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress value={s.avgProgress} className="h-2" />
                        <span className="text-sm font-bold w-9 text-right text-brand">
                          {s.avgProgress}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="mt-0 outline-none">
          <Card className="border-slate-200 shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold text-brand">Nome do Curso</TableHead>
                  <TableHead className="text-center font-bold text-brand">
                    Total de Alunos
                  </TableHead>
                  <TableHead className="text-center font-bold text-brand">Concluíram</TableHead>
                  <TableHead className="font-bold text-brand w-[30%]">Conclusão Média</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseReports.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-bold text-slate-800">{c.title}</TableCell>
                    <TableCell className="text-center font-medium">{c.studentsCount}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-bold">
                        {c.completedCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress value={c.avgProgress} className="h-2 bg-primary/20" />
                        <span className="text-sm font-bold w-9 text-right text-primary">
                          {c.avgProgress}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-0 outline-none">
          <Card className="border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold text-brand">Data / Hora</TableHead>
                    <TableHead className="font-bold text-brand">Aluno</TableHead>
                    <TableHead className="font-bold text-brand">Curso</TableHead>
                    <TableHead className="font-bold text-brand">Atividade Realizada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityReports.slice(0, 100).map((act) => (
                    <TableRow key={act.id}>
                      <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {new Date(act.date).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell className="font-medium">{act.student?.name}</TableCell>
                      <TableCell className="text-sm text-slate-600 line-clamp-1 max-w-[200px]">
                        {act.course?.title}
                      </TableCell>
                      <TableCell>
                        <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded text-xs font-semibold">
                          {act.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <div className="text-xs text-muted-foreground mt-1">{act.details}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
