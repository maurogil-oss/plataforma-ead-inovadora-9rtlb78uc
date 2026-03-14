import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

const salesData = [
  { name: 'Semana 1', currentMonth: 4000, previousMonth: 2400 },
  { name: 'Semana 2', currentMonth: 3000, previousMonth: 1398 },
  { name: 'Semana 3', currentMonth: 2000, previousMonth: 9800 },
  { name: 'Semana 4', currentMonth: 2780, previousMonth: 3908 },
]

const enrollData = [
  { month: 'Jan', currentYear: 120, previousYear: 80 },
  { month: 'Fev', currentYear: 150, previousYear: 90 },
  { month: 'Mar', currentYear: 180, previousYear: 110 },
  { month: 'Abr', currentYear: 220, previousYear: 130 },
  { month: 'Mai', currentYear: 250, previousYear: 150 },
  { month: 'Jun', currentYear: 280, previousYear: 170 },
]

const courseData = [
  { course: 'Gestão Ágil', rate: 85 },
  { course: 'Marketing', rate: 65 },
  { course: 'Data Science', rate: 45 },
  { course: 'Design UI', rate: 75 },
]

export default function ComparativeDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-brand">Receita de Vendas</CardTitle>
            <CardDescription>Comparativo Mês Atual vs Mês Anterior</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                currentMonth: { label: 'Mês Atual', color: 'hsl(var(--primary))' },
                previousMonth: { label: 'Mês Anterior', color: 'hsl(var(--brand-blue))' },
              }}
              className="h-[300px] w-full"
            >
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="currentMonth"
                  fill="var(--color-currentMonth)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="previousMonth"
                  fill="var(--color-previousMonth)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-brand">Novas Matrículas</CardTitle>
            <CardDescription>Crescimento Ano Atual vs Ano Anterior</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                currentYear: { label: 'Ano Atual', color: 'hsl(var(--primary))' },
                previousYear: { label: 'Ano Anterior', color: 'hsl(var(--brand-blue))' },
              }}
              className="h-[300px] w-full"
            >
              <LineChart data={enrollData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="currentYear"
                  stroke="var(--color-currentYear)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="previousYear"
                  stroke="var(--color-previousYear)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-brand">Performance de Cursos</CardTitle>
          <CardDescription>Taxa de conclusão média por curso (%)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ rate: { label: 'Taxa de Conclusão (%)', color: 'hsl(var(--primary))' } }}
            className="h-[300px] w-full"
          >
            <BarChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="course" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="rate" fill="var(--color-rate)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
