import { useState } from 'react'
import { useLmsStore } from '@/stores/lmsStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Save, Percent } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

export default function CommissionSettings() {
  const { commissionSettings, updateCommissionSettings, courses } = useLmsStore()
  const [settings, setSettings] = useState(commissionSettings)

  const handleSave = () => {
    updateCommissionSettings(settings)
    toast.success('Regras de comissionamento atualizadas com sucesso.')
  }

  const coursesWithOverrides = courses.filter(
    (c) => c.instructorRateOverride !== undefined || c.partnerRateOverride !== undefined,
  )

  return (
    <div className="space-y-8 max-w-4xl pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Taxas & Comissões</h1>
        <p className="text-muted-foreground mt-1">
          Configure a distribuição de receita (Split) padrão da plataforma.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="size-5 text-primary" /> Divisão Padrão (Global)
          </CardTitle>
          <CardDescription>
            Estas taxas serão aplicadas automaticamente em todas as vendas, exceto se o curso
            possuir uma taxa específica. O valor restante fica para a plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Comissão Padrão do Professor (%)</label>
              <Input
                type="number"
                value={settings.defaultInstructorRate}
                onChange={(e) =>
                  setSettings({ ...settings, defaultInstructorRate: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Comissão Padrão de Afiliados (%)</label>
              <Input
                type="number"
                value={settings.defaultPartnerRate}
                onChange={(e) =>
                  setSettings({ ...settings, defaultPartnerRate: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg flex items-center justify-between border">
            <span className="font-medium">Taxa Retida pela Plataforma:</span>
            <span className="text-xl font-bold text-primary">
              {100 - settings.defaultInstructorRate - settings.defaultPartnerRate}%
            </span>
          </div>

          <Button onClick={handleSave} className="w-full sm:w-auto">
            <Save className="mr-2 size-4" /> Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cursos com Taxas Específicas</CardTitle>
          <CardDescription>
            Estes cursos possuem comissionamento diferente do padrão.
          </CardDescription>
        </CardHeader>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Curso</TableHead>
              <TableHead className="text-center">Professor</TableHead>
              <TableHead className="text-center">Parceiro</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coursesWithOverrides.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell className="text-center">
                  {c.instructorRateOverride !== undefined ? (
                    `${c.instructorRateOverride}%`
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      Padrão ({settings.defaultInstructorRate}%)
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {c.partnerRateOverride !== undefined ? (
                    `${c.partnerRateOverride}%`
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      Padrão ({settings.defaultPartnerRate}%)
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="link" asChild size="sm">
                    <Link to={`/manager/courses/${c.id}/edit`}>Editar</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {coursesWithOverrides.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  Nenhum curso possui taxa específica configurada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
