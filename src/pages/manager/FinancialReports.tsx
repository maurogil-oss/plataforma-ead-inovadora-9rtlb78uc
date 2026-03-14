import { useMemo } from 'react'
import { useLmsStore } from '@/stores/lmsStore'
import { downloadCSV, printPDF } from '@/lib/export'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, FileText, File } from 'lucide-react'
import { toast } from 'sonner'

export default function FinancialReports() {
  const { transactions, courses, students, instructors } = useLmsStore()

  const allUsers = [...students, ...instructors]

  const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0)
  const platformProfit = transactions.reduce((acc, t) => {
    const split = t.splits.find((s) => s.role === 'platform')
    return acc + (split?.amount || 0)
  }, 0)
  const instructorPayouts = transactions.reduce((acc, t) => {
    const split = t.splits.find((s) => s.role === 'instructor')
    return acc + (split?.amount || 0)
  }, 0)
  const affiliatePayouts = transactions.reduce((acc, t) => {
    const split = t.splits.find((s) => s.role === 'partner')
    return acc + (split?.amount || 0)
  }, 0)

  const revenueByCourse = useMemo(() => {
    return courses
      .map((c) => {
        const courseTxs = transactions.filter((t) => t.courseId === c.id)
        const total = courseTxs.reduce((sum, t) => sum + t.amount, 0)
        return { id: c.id, title: c.title, totalRevenue: total, salesCount: courseTxs.length }
      })
      .filter((c) => c.salesCount > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
  }, [courses, transactions])

  const handleExport = async (format: 'csv' | 'pdf') => {
    toast.info('Preparando exportação financeira...', { id: 'export-fin-toast' })
    await new Promise((r) => setTimeout(r, 600))

    try {
      const title = 'Relatório Financeiro Detalhado'
      const headers = [
        'Data',
        'Produto / Curso',
        'Comprador',
        'Valor Total (R$)',
        'Lucro Plataforma (R$)',
        'Repasse Prof. (R$)',
        'Repasse Afil. (R$)',
      ]

      const rows = transactions.map((t) => {
        const course = courses.find((c) => c.id === t.courseId)
        const buyer = students.find((s) => s.id === t.studentId)
        const platSplit = t.splits.find((s) => s.role === 'platform')
        const instSplit = t.splits.find((s) => s.role === 'instructor')
        const partSplit = t.splits.find((s) => s.role === 'partner')

        return [
          new Date(t.date).toLocaleString('pt-BR'),
          course?.title || 'Não Identificado',
          buyer?.name || '-',
          t.amount.toFixed(2),
          platSplit?.amount.toFixed(2) || '0.00',
          instSplit?.amount.toFixed(2) || '0.00',
          partSplit?.amount.toFixed(2) || '0.00',
        ]
      })

      const summary = [
        `Receita Bruta Total:::R$ ${totalRevenue.toFixed(2)}`,
        `Receita Líquida (Plataforma):::R$ ${platformProfit.toFixed(2)}`,
        `Repasse aos Autores/Prof.:::R$ ${instructorPayouts.toFixed(2)}`,
        `Repasse a Afiliados:::R$ ${affiliatePayouts.toFixed(2)}`,
      ]

      if (format === 'csv') {
        downloadCSV(`financeiro_${Date.now()}`, headers, rows)
      } else {
        printPDF(title, headers, rows, summary)
      }

      toast.success('Relatório financeiro exportado!', { id: 'export-fin-toast' })
    } catch (e) {
      toast.error('Erro ao processar exportação.', { id: 'export-fin-toast' })
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand">Relatório Financeiro</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o faturamento geral, performance de vendas por curso e comissões.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-brand text-brand font-bold">
              <Download className="mr-2 size-4" /> Exportar Relatório
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wide">
              Volume Geral (Receita)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-brand">R$ {totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/50 bg-primary/5 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-primary uppercase tracking-wide">
              Lucro da Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-primary">
              R$ {platformProfit.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wide">
              Repasse a Professores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-700">
              R$ {instructorPayouts.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wide">
              Repasse a Afiliados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-700">
              R$ {affiliatePayouts.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-brand">Receita por Curso (Produtos)</CardTitle>
          <CardDescription>Desempenho individual de vendas de cada treinamento.</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold text-brand">Nome do Curso</TableHead>
              <TableHead className="text-center font-bold text-brand">
                Matrículas / Vendas
              </TableHead>
              <TableHead className="text-right font-bold text-brand">
                Receita Total Gerada
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {revenueByCourse.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-bold text-slate-800">{c.title}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="font-bold">
                    {c.salesCount}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-extrabold text-primary text-lg">
                  R$ {c.totalRevenue.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-brand">Histórico de Transações (Splits)</CardTitle>
          <CardDescription>Detalhamento de cada venda e a divisão de valores.</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold text-brand">Data</TableHead>
                <TableHead className="font-bold text-brand">Curso / Comprador</TableHead>
                <TableHead className="text-center font-bold text-brand">Valor Total</TableHead>
                <TableHead className="text-right font-bold text-brand">Plataforma</TableHead>
                <TableHead className="text-right font-bold text-brand">Professor</TableHead>
                <TableHead className="text-right font-bold text-brand">Afiliado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => {
                const course = courses.find((c) => c.id === t.courseId)
                const buyer = students.find((s) => s.id === t.studentId)
                const platSplit = t.splits.find((s) => s.role === 'platform')
                const instSplit = t.splits.find((s) => s.role === 'instructor')
                const partSplit = t.splits.find((s) => s.role === 'partner')
                const partnerName = allUsers.find((u) => u.id === partSplit?.userId)?.name

                return (
                  <TableRow key={t.id}>
                    <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {new Date(t.date).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-800 text-sm line-clamp-1 max-w-[250px]">
                        {course?.title || 'Curso Indefinido'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Aluno: {buyer?.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-800">
                      R$ {t.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right bg-primary/5 font-extrabold text-primary">
                      {platSplit ? `R$ ${platSplit.amount.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-700">
                      {instSplit ? `R$ ${instSplit.amount.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {partSplit ? (
                        <>
                          <div className="text-emerald-600 font-bold">
                            R$ {partSplit.amount.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate max-w-[100px] ml-auto">
                            {partnerName}
                          </div>
                        </>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-slate-400">
                          Direta
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
