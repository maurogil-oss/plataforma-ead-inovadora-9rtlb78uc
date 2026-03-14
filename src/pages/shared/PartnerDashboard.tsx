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
import {
  Handshake,
  Copy,
  Link as LinkIcon,
  DollarSign,
  Activity,
  Percent,
  ArrowRight,
  Share2,
  Users,
  Rocket,
} from 'lucide-react'
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
        <div className="bg-primary/10 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-primary mb-6 shadow-inner">
          <Handshake className="size-12" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Programa de Parceiros</h1>
        <p className="text-lg text-muted-foreground font-medium">
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
      <div className="space-y-16 pb-20 pt-8 max-w-5xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="bg-primary/10 w-24 h-24 mx-auto rounded-full flex items-center justify-center text-primary mb-8 shadow-inner ring-8 ring-primary/5">
            <Rocket className="size-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Programa de Parceiros <br />
            Observatório Academy
          </h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            Monetize sua influência. Torne-se um afiliado e ganhe até{' '}
            <strong className="text-primary">
              {commissionSettings.defaultPartnerRate}% de comissão
            </strong>{' '}
            por cada venda realizada através do seu link exclusivo.
          </p>
          <div className="pt-4">
            <Button
              size="lg"
              className="text-xl h-14 px-10 shadow-xl font-bold"
              onClick={() => {
                becomePartner(authUser.id)
                toast.success('Parceria ativada com sucesso! Bem-vindo ao time.')
              }}
            >
              Quero ser um Parceiro <ArrowRight className="ml-2 size-5" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pt-8">
          <Card className="bg-muted/30 border-none shadow-none text-center p-6">
            <div className="mx-auto bg-background w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-4">
              <Share2 className="size-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">1. Compartilhe</h3>
            <p className="text-sm text-muted-foreground">
              Gere links exclusivos dos nossos cursos e divulgue para sua rede de contatos.
            </p>
          </Card>
          <Card className="bg-muted/30 border-none shadow-none text-center p-6">
            <div className="mx-auto bg-background w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-4">
              <Users className="size-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">2. Engaje</h3>
            <p className="text-sm text-muted-foreground">
              Sua audiência clica, se interessa pelo material de alta qualidade e realiza a
              matrícula.
            </p>
          </Card>
          <Card className="bg-muted/30 border-none shadow-none text-center p-6">
            <div className="mx-auto bg-background w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-4">
              <DollarSign className="size-6 text-success" />
            </div>
            <h3 className="font-bold text-lg mb-2">3. Fature</h3>
            <p className="text-sm text-muted-foreground">
              Você recebe automaticamente as comissões direto na sua conta, com total transparência.
            </p>
          </Card>
        </div>

        <div className="border-t pt-16">
          <h2 className="text-2xl font-extrabold text-center mb-10">Alguns de nossos parceiros</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <img
              src="https://img.usecurling.com/i?q=company&color=gray"
              className="h-10 object-contain"
              alt="Partner 1"
            />
            <img
              src="https://img.usecurling.com/i?q=brand&color=gray"
              className="h-10 object-contain"
              alt="Partner 2"
            />
            <img
              src="https://img.usecurling.com/i?q=tech&color=gray"
              className="h-10 object-contain"
              alt="Partner 3"
            />
            <img
              src="https://img.usecurling.com/i?q=business&color=gray"
              className="h-10 object-contain"
              alt="Partner 4"
            />
          </div>
        </div>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Painel do Parceiro</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Acompanhe suas indicações, gere links e gerencie suas comissões.
          </p>
        </div>
        <Badge
          variant="outline"
          className="px-4 py-1.5 text-sm bg-success/10 text-success border-success/20 font-bold uppercase tracking-widest"
        >
          Parceria Ativa
        </Badge>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="bg-card hover:shadow-md transition-shadow border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
              <Activity className="size-4" /> Vendas Geradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold">{partnerSales.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-success flex items-center gap-2 uppercase tracking-wider">
              <DollarSign className="size-4" /> Ganhos Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-success">R$ {totalEarned.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-card hover:shadow-md transition-shadow border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
              <Percent className="size-4" /> Comissão Padrão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-primary">
              {commissionSettings.defaultPartnerRate}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <LinkIcon className="size-5 text-primary" /> Central de Links Promocionais
          </CardTitle>
          <CardDescription className="text-base font-medium">
            Selecione o curso que deseja promover para gerar sua URL única de rastreamento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 bg-muted/10 p-6 rounded-xl border border-dashed mx-6 mb-6">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="h-12 text-base font-medium bg-background">
              <SelectValue placeholder="Escolha um conteúdo de alta conversão..." />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id} className="py-3 cursor-pointer">
                  <span className="font-bold">{c.title}</span>{' '}
                  <span className="text-muted-foreground ml-2">— R$ {c.price.toFixed(2)}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCourse && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                readOnly
                value={affiliateLink}
                className="h-12 bg-background font-mono text-sm text-primary font-medium"
              />
              <Button onClick={copyLink} className="h-12 px-8 font-bold shrink-0 shadow-md">
                <Copy className="mr-2 size-4" /> Copiar Link Seguro
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Histórico de Conversões</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="font-bold">Data da Venda</TableHead>
                <TableHead className="font-bold">Produto</TableHead>
                <TableHead className="font-bold text-right">Valor Pago</TableHead>
                <TableHead className="font-bold text-right">Sua Comissão Líquida</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partnerSales.map((t) => {
                const course = courses.find((c) => c.id === t.courseId)
                const split = t.splits.find((s) => s.userId === authUser.id && s.role === 'partner')
                return (
                  <TableRow key={t.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium text-sm text-muted-foreground">
                      {new Date(t.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-bold text-foreground">
                      {course?.title || 'Curso Removido'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {t.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-extrabold text-success text-lg bg-success/10 px-2 py-0.5 rounded">
                        + R$ {split?.amount.toFixed(2)}
                      </span>
                      <span className="block text-xs font-semibold text-muted-foreground mt-1">
                        Taxa: {split?.percentage}%
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
              {partnerSales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Share2 className="size-10 mb-3 opacity-20" />
                      <p className="font-medium text-lg">Você ainda não gerou nenhuma venda.</p>
                      <p className="text-sm mt-1">Compartilhe seu link para começar a faturar.</p>
                    </div>
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
