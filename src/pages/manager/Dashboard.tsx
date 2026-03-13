import { useLmsStore } from '@/stores/lmsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, GraduationCap, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ManagerDashboard() {
  const { courses, students, enrollments } = useLmsStore()

  const stats = [
    {
      title: 'Total de Cursos',
      value: courses.length,
      icon: BookOpen,
      desc: 'Cursos ativos na plataforma',
      link: '/manager/courses',
    },
    {
      title: 'Alunos Registrados',
      value: students.length,
      icon: Users,
      desc: 'Usuários com acesso ao portal',
      link: '/manager/enrollments',
    },
    {
      title: 'Matrículas Vigentes',
      value: enrollments.length,
      icon: GraduationCap,
      desc: 'Inscrições em andamento',
      link: '/manager/enrollments',
    },
  ]

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe os principais indicadores da sua plataforma de ensino.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link to={stat.link} key={stat.title} className="group outline-none">
            <Card className="hover:border-primary/50 transition-colors h-full flex flex-col bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-md text-primary group-hover:scale-110 transition-transform">
                  <stat.icon className="size-5" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="text-4xl font-bold tracking-tight mb-2">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.desc}
                  <ArrowUpRight className="ml-auto size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm border-b pb-4 last:border-0 last:pb-0">
                <div className="size-2 bg-success rounded-full" />
                <span className="font-medium">João Silva</span> matriculou-se em{' '}
                <span className="text-primary font-medium">Gestão de Projetos</span>
                <span className="ml-auto text-muted-foreground text-xs">Há 2 horas</span>
              </div>
              <div className="flex items-center gap-4 text-sm border-b pb-4 last:border-0 last:pb-0">
                <div className="size-2 bg-primary rounded-full" />
                <span className="font-medium">Maria Souza</span> concluiu o curso de{' '}
                <span className="text-primary font-medium">Segurança da Informação</span>
                <span className="ml-auto text-muted-foreground text-xs">Há 5 horas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
