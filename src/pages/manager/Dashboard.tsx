import { useLmsStore } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, GraduationCap, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ManagerDashboard() {
  const user = useAuthStore((s) => s.user)
  const { courses, enrollments } = useLmsStore()

  const myCourses =
    user?.role === 'instructor' ? courses.filter((c) => c.instructorId === user.id) : courses
  const myCourseIds = myCourses.map((c) => c.id)
  const myEnrollments =
    user?.role === 'instructor'
      ? enrollments.filter((e) => myCourseIds.includes(e.courseId))
      : enrollments

  const uniqueStudents = new Set(myEnrollments.map((e) => e.studentId)).size
  const basePath = user?.role === 'instructor' ? '/instructor' : '/manager'

  const stats = [
    {
      title: 'Cursos Gerenciados',
      value: myCourses.length,
      icon: BookOpen,
      desc: 'Cursos sob sua responsabilidade',
      link: `${basePath}/courses`,
    },
    {
      title: 'Alunos Ativos',
      value: uniqueStudents,
      icon: Users,
      desc: 'Alunos matriculados',
      link: `${basePath}/enrollments`,
    },
    {
      title: 'Matrículas',
      value: myEnrollments.length,
      icon: GraduationCap,
      desc: 'Inscrições em andamento',
      link: `${basePath}/enrollments`,
    },
  ]

  const recentActivity = myEnrollments
    .flatMap((e) =>
      e.activityLog.map((act) => ({
        ...act,
        courseTitle: courses.find((c) => c.id === e.courseId)?.title,
      })),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {user?.role === 'instructor' ? 'Painel do Professor' : 'Visão Geral'}
        </h1>
        <p className="text-muted-foreground mt-1">Acompanhe os indicadores dos seus cursos.</p>
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
            <CardTitle className="text-lg">Atividade Recente (Seus Cursos)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center gap-4 text-sm border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="size-2 bg-primary rounded-full" />
                  <div className="flex-1">
                    <span className="font-medium">{act.type}</span> - {act.details}
                    <div className="text-muted-foreground text-xs">{act.courseTitle}</div>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {new Date(act.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-muted-foreground text-sm">Nenhuma atividade recente.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
