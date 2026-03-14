import { useState, useMemo } from 'react'
import { useLmsStore } from '@/stores/lmsStore'
import { downloadCSV, printPDF } from '@/lib/export'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Download, Users, BookOpen, Activity, FileText, File } from 'lucide-react'
import { toast } from 'sonner'

export default function Reports() {
  const { enrollments, students, courses } = useLmsStore()
  const [activeTab, setActiveTab] = useState('students')
  const [courseFilter, setCourseFilter] = useState('all')

  const filteredEnrollments = useMemo(() => {
    if (courseFilter === 'all') return enrollments
    return enrollments.filter((e) => e.courseId === courseFilter)
  }, [enrollments, courseFilter])

  const studentReports = useMemo(() => {
    const studentData = new Map()
    filteredEnrollments.forEach((e) => {
      if (!studentData.has(e.studentId)) {
        studentData.set(e.studentId, {
          student: students.find((s) => s.id === e.studentId),
          enrollments: [],
        })
      }
      studentData.get(e.studentId).enrollments.push(e)
    })

    return Array.from(studentData.values()).map(({ student, enrollments }) => {
      let totalProgress = 0
      enrollments.forEach((e: any) => {
        const c = courses.find((x) => x.id === e.courseId)
        const totalLessons = c?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0
        totalProgress += totalLessons > 0 ? (e.completedLessons.length / totalLessons) * 100 : 0
      })
      const avgProgress = enrollments.length > 0 ? totalProgress / enrollments.length : 0

      return {
        id: student?.id,
        name: student?.name,
        email: student?.email,
        courseCount: enrollments.length,
        avgProgress: Math.round(avgProgress),
      }
    })
  }, [filteredEnrollments, students, courses])

  const courseReports = useMemo(() => {
    const relevantCourses =
      courseFilter === 'all' ? courses : courses.filter((c) => c.id === courseFilter)

    return relevantCourses.map((c) => {
      const courseEnrolls = enrollments.filter((e) => e.courseId === c.id)
      const totalLessons = c.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0
      let sumProgress = 0
      let completedCount = 0

      courseEnrolls.forEach((e) => {
        const progress = totalLessons > 0 ? (e.completedLessons.length / totalLessons) * 100 : 0
        sumProgress += progress
        if (e.isCompleted) completedCount++
      })

      return {
        id: c.id,
        title: c.title,
        studentsCount: courseEnrolls.length,
        avgProgress: courseEnrolls.length > 0 ? Math.round(sumProgress / courseEnrolls.length) : 0,
        completedCount,
      }
    })
  }, [enrollments, courses, courseFilter])

  const activityReports = useMemo(() => {
    return filteredEnrollments
      .flatMap((e) =>
        e.activityLog.map((act) => ({
          ...act,
          student: students.find((s) => s.id === e.studentId),
          course: courses.find((c) => c.id === e.courseId),
        })),
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [filteredEnrollments, students, courses])

  const handleExport = async (format: 'csv' | 'pdf') => {
    toast.info('Preparando exportação...', { id: 'export-toast' })
    await new Promise((r) => setTimeout(r, 600)) // Simulation delay for UX

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
      } else {
        title = 'Relatório de Atividades'
        headers = ['Data / Hora', 'Aluno', 'Curso', 'Atividade Realizada', 'Detalhes']
        rows = activityReports.map((act) => [
          new Date(act.date).toLocaleString('pt-BR'),
          act.student?.name || '-',
          act.course?.title || '-',
          act.type.replace('_', ' ').toUpperCase(),
          act.details || '-',
        ])
      }

      if (format === 'csv') {
        downloadCSV(`relatorio_${activeTab}_${Date.now()}`, headers, rows)
      } else {
        printPDF(title, headers, rows)
      }

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
            Acompanhe o engajamento e a evolução dos alunos.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-brand text-brand font-bold">
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
              <File className="mr-2 size-4 text-orange-600" /> Exportar como PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border flex flex-col md:flex-row items-center gap-4 shadow-sm">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto gap-2 bg-transparent mb-6">
          <TabsTrigger
            value="students"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-white shadow-sm py-3 font-semibold"
          >
            <Users className="mr-2 size-4" /> Desempenho por Aluno
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-white shadow-sm py-3 font-semibold"
          >
            <BookOpen className="mr-2 size-4" /> Desempenho por Curso
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-white shadow-sm py-3 font-semibold"
          >
            <Activity className="mr-2 size-4" /> Relatório de Atividades
          </TabsTrigger>
        </TabsList>

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
