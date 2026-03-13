import { Trophy, Medal, Star, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts'
import { MOCK_USER, MOCK_SKILLS, MOCK_BADGES } from '@/data/mock'

const chartConfig = {
  score: { label: 'Proficiência', color: 'hsl(var(--primary))' },
}

export default function Profile() {
  const IconMap: Record<string, any> = { ShieldCheck: Shield, Moon: Star, HeartPulse: Medal }

  return (
    <div className="space-y-8 pb-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <Card className="glass-card overflow-hidden border-primary/20">
        <div className="h-32 bg-gradient-to-r from-secondary via-background to-secondary relative">
          <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/800/200?q=road&color=gray')] opacity-20 object-cover mix-blend-overlay" />
        </div>
        <CardContent className="relative px-6 pb-6 sm:px-10 flex flex-col sm:flex-row gap-6 sm:items-end -mt-12">
          <Avatar className="size-24 border-4 border-card bg-card shadow-xl">
            <AvatarImage src={MOCK_USER.avatar} />
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="text-3xl font-display font-bold">{MOCK_USER.name}</h1>
            <p className="text-muted-foreground">{MOCK_USER.role}</p>
          </div>
          <div className="w-full sm:w-64 space-y-2 bg-black/20 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between text-sm items-center">
              <span className="font-bold text-primary">Nível {MOCK_USER.level}</span>
              <span className="text-muted-foreground text-xs">
                {MOCK_USER.xp} / {MOCK_USER.xpNext} XP
              </span>
            </div>
            <Progress value={(MOCK_USER.xp / MOCK_USER.xpNext) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <Card className="glass-card flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="size-5 text-primary" /> Mapeamento de Habilidades
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center min-h-[300px]">
            <ChartContainer config={chartConfig} className="w-full max-w-[400px] aspect-square">
              <RadarChart data={MOCK_SKILLS} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Radar
                  dataKey="score"
                  fill="var(--color-score)"
                  fillOpacity={0.4}
                  stroke="var(--color-score)"
                  strokeWidth={2}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Trophy Case */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="size-5 text-primary" /> Sala de Troféus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_BADGES.map((badge) => {
                const Icon = IconMap[badge.icon] || Trophy
                return (
                  <div
                    key={badge.id}
                    className="group relative flex flex-col items-center p-4 bg-black/20 rounded-xl border border-white/5 hover:border-primary/50 hover:bg-white/5 transition-all text-center"
                  >
                    <div className="size-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3 shadow-glow group-hover:scale-110 transition-transform">
                      <Icon className="size-7 text-primary" />
                    </div>
                    <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
                      {badge.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{badge.desc}</p>
                    <Badge
                      variant="outline"
                      className="mt-auto text-[10px] bg-black/40 border-white/10"
                    >
                      {badge.date}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Target(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}
