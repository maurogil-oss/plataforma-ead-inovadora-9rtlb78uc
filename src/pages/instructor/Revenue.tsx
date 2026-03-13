import { useAuthStore } from '@/stores/authStore'
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
import { Wallet, Presentation, Handshake } from 'lucide-react'

export default function Revenue() {
  const user = useAuthStore((s) => s.user)
  const { transactions, courses } = useLmsStore()

  if (!user) return null

  const myTransactions = transactions.filter((t) => t.splits.some((s) => s.userId === user.id))

  const instructorRevenue = myTransactions.reduce((acc, t) => {
    const split = t.splits.find((s) => s.userId === user.id && s.role === 'instructor')
    return acc + (split?.amount || 0)
  }, 0)

  const affiliateRevenue = myTransactions.reduce((acc, t) => {
    const split = t.splits.find((s) => s.userId === user.id && s.role === 'partner')
    return acc + (split?.amount || 0)
  }, 0)

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minhas Receitas</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe seus ganhos como professor e como afiliado.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
              <Wallet className="size-4" /> Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              R$ {(instructorRevenue + affiliateRevenue).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Presentation className="size-4" /> Comissões como Professor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {instructorRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Handshake className="size-4" /> Comissões como Afiliado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">R$ {affiliateRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Extrato Detalhado</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Curso Vendido</TableHead>
              <TableHead>Tipo de Comissão</TableHead>
              <TableHead className="text-right">Valor Recebido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myTransactions.map((t) => {
              const course = courses.find((c) => c.id === t.courseId)
              const splitsForMe = t.splits.filter((s) => s.userId === user.id)

              return splitsForMe.map((split, i) => (
                <TableRow key={`${t.id}-${i}`}>
                  <TableCell className="font-medium text-sm">
                    {new Date(t.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{course?.title}</TableCell>
                  <TableCell>
                    {split.role === 'instructor' ? (
                      <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-semibold">
                        Professor ({split.percentage}%)
                      </span>
                    ) : (
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-semibold">
                        Afiliado ({split.percentage}%)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    + R$ {split.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            })}
            {myTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Você ainda não possui receitas registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
