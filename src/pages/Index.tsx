import { Link } from 'react-router-dom'
import { Play, Clock, Trophy, Target, Globe, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { MOCK_USER, MOCK_COURSES, MOCK_ACTIVITY } from '@/data/mock'

const Index = () => {
  const currentCourse = MOCK_COURSES[0]

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <section>
        <h1 className="text-3xl font-display font-bold mb-6">
          Olá, {MOCK_USER.name.split(' ')[0]} 👋
        </h1>
        <Card className="glass-card overflow-hidden relative border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
          <CardContent className="p-0 sm:flex items-center">
            <div className="p-6 sm:p-8 flex-1 space-y-4 relative z-10">
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                Continuar Aprendendo
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {currentCourse.title}
                </h2>
                <p className="text-muted-foreground mt-1">Módulo 3: Distância de Seguimento</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso do Curso</span>
                  <span className="font-medium text-primary">{currentCourse.progress}%</span>
                </div>
                <Progress value={currentCourse.progress} className="h-2" />
              </div>
              <Button
                size="lg"
                asChild
                className="mt-4 shadow-glow hover:-translate-y-0.5 transition-transform"
              >
                <Link to={`/course/${currentCourse.id}`}>
                  <Play className="mr-2 size-5 fill-current" /> Retomar Aula
                </Link>
              </Button>
            </div>
            <div className="w-full sm:w-1/3 h-48 sm:h-auto relative hidden sm:block">
              <img
                src={currentCourse.thumbnail}
                alt="Curso"
                className="absolute inset-0 w-full h-full object-cover rounded-r-lg opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-card to-transparent" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Horas de Estudo', value: MOCK_USER.hours, icon: Clock, color: 'text-blue-500' },
          { label: 'Pontos de XP', value: MOCK_USER.xp, icon: Target, color: 'text-primary' },
          {
            label: 'Certificados',
            value: MOCK_USER.certificates,
            icon: Trophy,
            color: 'text-success',
          },
          {
            label: 'Ranking Global',
            value: `#${MOCK_USER.rank}`,
            icon: Globe,
            color: 'text-accent',
          },
        ].map((stat, i) => (
          <Card key={i} className="glass-card">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <stat.icon className={`size-8 ${stat.color} mb-2 opacity-80`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Recommended Paths */}
        <section className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Recomendados para Você</h3>
            <Button variant="link" className="text-primary p-0 h-auto">
              Ver todos <ChevronRight className="size-4" />
            </Button>
          </div>
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex w-max space-x-4">
              {MOCK_COURSES.slice(1).map((course) => (
                <Card
                  key={course.id}
                  className="w-[300px] glass-card overflow-hidden group cursor-pointer hover:border-primary/50"
                >
                  <div className="h-32 relative overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {course.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold line-clamp-1 group-hover:text-primary transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">{course.instructor}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        {/* Activity Feed */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold">Atividade da Rede</h3>
          <Card className="glass-card">
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {MOCK_ACTIVITY.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 flex gap-3 text-sm hover:bg-white/5 transition-colors"
                  >
                    <div className="size-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      {activity.user.charAt(0)}
                    </div>
                    <div>
                      <p>
                        <span className="font-medium text-foreground">{activity.user}</span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>{' '}
                        <span className="font-medium text-primary">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default Index
