import { useLmsStore } from '@/stores/lmsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

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

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatório Financeiro</h1>
        <p className="text-muted-foreground mt-1">
          Transações, splits e divisão de receitas da plataforma.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Volume Transacionado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">Lucro Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">R$ {platformProfit.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Repasse Professores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              R$ {instructorPayouts.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Repasse Afiliados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              R$ {affiliatePayouts.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações e Splits</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Curso / Comprador</TableHead>
                <TableHead className="text-center">Valor Base</TableHead>
                <TableHead className="text-right">Split: Plataforma</TableHead>
                <TableHead className="text-right">Split: Professor</TableHead>
                <TableHead className="text-right">Split: Afiliado</TableHead>
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
                    <TableCell className="text-xs whitespace-nowrap">
                      {new Date(t.date).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{course?.title}</div>
                      <div className="text-xs text-muted-foreground">Comprador: {buyer?.name}</div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      R$ {t.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right bg-primary/5 font-semibold text-primary">
                      {platSplit ? `R$ ${platSplit.amount.toFixed(2)}` : '-'}
                      {platSplit && (
                        <div className="text-[10px] font-normal text-muted-foreground">
                          {platSplit.percentage}%
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {instSplit ? `R$ ${instSplit.amount.toFixed(2)}` : '-'}
                      {instSplit && (
                        <div className="text-[10px] text-muted-foreground">
                          {instSplit.percentage}%
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {partSplit ? (
                        <>
                          <div className="text-success font-medium">
                            R$ {partSplit.amount.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {partnerName} ({partSplit.percentage}%)
                          </div>
                        </>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          Venda Direta
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhuma transação registrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
