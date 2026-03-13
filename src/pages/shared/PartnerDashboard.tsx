import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useLmsStore } from '@/stores/lmsStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Handshake, Copy, Link as LinkIcon, DollarSign, Activity, Percent } from 'lucide-react'
import { toast } from 'sonner'

export default function PartnerDashboard() {
  const authUser = useAuthStore((s) => s.user)
  const { students, instructors, courses, transactions, becomePartner, commissionSettings } =
    useLmsStore()
  const [selectedCourse, setSelectedCourse] = useState<string>('')

  if (!authUser) return null

  if (authUser.role === 'manager') {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center space-y-6">
        <div className="bg-primary/10 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-primary mb-6">
          <Handshake className="size-12" />
        </div>
        <h1 className="text-3xl font-bold">Programa de Parceiros</h1>
        <p className="text-lg text-muted-foreground">
          Visão de Gestor: Acesse com um perfil de Aluno ou Professor para simular o painel de
          Afiliado/Parceiro e gerar links de rastreamento.
        </p>
      </div>
    )
  }

  const lmsUser =
    students.find((s) => s.id === authUser.id) || instructors.find((i) => i.id === authUser.id)

  if (!lmsUser?.isPartner) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center space-y-6">
        <div className="bg-primary/10 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-primary mb-6">
          <Handshake className="size-12" />
        </div>
        <h1 className="text-3xl font-bold">Programa de Parceiros</h1>
        <p className="text-lg text-muted-foreground">
          Torne-se um afiliado e ganhe comissões por cada venda realizada através do seu link
          exclusivo.
        </p>
        <div className="p-6 bg-muted/30 rounded-xl text-left space-y-4 my-8 border">
          <h3 className="font-semibold text-lg">Como funciona?</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>1. Você ativa sua parceria gratuitamente.</li>
            <li>2. Gera links exclusivos para os cursos da plataforma.</li>
            <li>3. Compartilha com sua rede, alunos ou amigos.</li>
            <li>
              4. Recebe a comissão ({commissionSettings.defaultPartnerRate}% padrão) a cada venda!
            </li>
          </ul>
        </div>
        <Button
          size="lg"
          className="w-full text-lg h-14"
          onClick={() => {
            becomePartner(authUser.id)
            toast.success('Parceria ativada com sucesso!')
          }}
        >
          Ativar Minha Parceria Agora
        </Button>
      </div>
    )
  }

  const partnerSales = transactions.filter((t) => t.affiliateId === authUser.id)
  const totalEarned = partnerSales.reduce((acc, t) => {
    const split = t.splits.find((s) => s.userId === authUser.id && s.role === 'partner')
    return acc + (split?.amount || 0)
  }, 0)

  const affiliateLink = selectedCourse ? `${window.location.origin}/login?ref=${authUser.id}` : ''

  const copyLink = () => {
    if (!affiliateLink) return toast.error('Selecione um curso primeiro.')
    navigator.clipboard.writeText(affiliateLink)
    toast.success('Link de afiliado copiado para a área de transferência.')
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel do Parceiro</h1>
        <p className="text-muted-foreground mt-1">Acompanhe suas indicações e comissões.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="size-4" /> Vendas Geradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{partnerSales.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="size-4" /> Ganhos Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">R$ {totalEarned.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Percent className="size-4" /> Comissão Padrão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{commissionSettings.defaultPartnerRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="size-5 text-primary" /> Gerador de Links de Afiliado
          </CardTitle>
          <CardDescription>Selecione um curso para gerar sua URL de rastreamento.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o curso que deseja promover" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title} - (R$ {c.price.toFixed(2)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCourse && (
            <div className="flex gap-2">
              <Input readOnly value={affiliateLink} className="bg-muted/50 font-mono text-sm" />
              <Button onClick={copyLink} variant="secondary" className="shrink-0">
                <Copy className="mr-2 size-4" /> Copiar URL
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas Indicadas</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Valor da Venda</TableHead>
                <TableHead className="text-right">Sua Comissão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partnerSales.map((t) => {
                const course = courses.find((c) => c.id === t.courseId)
                const split = t.splits.find((s) => s.userId === authUser.id && s.role === 'partner')
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">
                      {new Date(t.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{course?.title || 'Curso Removido'}</TableCell>
                    <TableCell>R$ {t.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-bold text-success">
                      + R$ {split?.amount.toFixed(2)}{' '}
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        ({split?.percentage}%)
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
              {partnerSales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Você ainda não gerou nenhuma venda.
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
