import { useState } from 'react'
import { FileText, Download, Filter, BarChart, FileBarChart, PieChart } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Logo } from '@/components/Logo'
import { exportToPDF, exportToCSV } from '@/lib/export'
import { useToast } from '@/hooks/use-toast'

export default function Reports() {
  const { toast } = useToast()
  const [reportType, setReportType] = useState('academic')

  const handleExportPDF = () => {
    exportToPDF({
      filename: `observatorio-relatorio-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`,
      title: `Relatório ${reportType === 'academic' ? 'Acadêmico' : reportType === 'financial' ? 'Financeiro' : 'de Desempenho'}`,
    })
    toast({
      title: 'PDF Gerado',
      description: 'O download do documento oficial começará em instantes.',
    })
  }

  const handleExportCSV = () => {
    exportToCSV({
      filename: `observatorio-dados-${reportType}`,
      title: 'Exportação de Dados',
      data: [
        { id: 1, tipo: reportType, status: 'Ativo', valor: 100 },
        { id: 2, tipo: reportType, status: 'Concluído', valor: 250 },
      ],
    })
    toast({
      title: 'CSV Exportado',
      description: 'Os dados foram baixados com sucesso.',
    })
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hidden sm:block">
            <Logo className="h-10 w-auto" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart className="h-7 w-7 text-blue-600" />
              Central de Relatórios Analíticos
            </h2>
            <p className="text-slate-500 mt-1">
              Gere, visualize e exporte relatórios oficiais com a identidade atualizada da academia.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-slate-900">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="academic">Relatório Acadêmico</SelectItem>
              <SelectItem value="financial">Relatório Financeiro</SelectItem>
              <SelectItem value="performance">Métricas de Desempenho</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="shrink-0">
            <Filter className="h-4 w-4 mr-2" /> Filtros
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow border-t-4 border-t-blue-500">
          <CardHeader>
            <FileBarChart className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle>Progresso Acadêmico</CardTitle>
            <CardDescription>
              Visão geral detalhada de matrículas, conclusões de cursos e taxas de certificação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                <span>Alunos Ativos:</span>
                <span className="font-bold text-slate-900 dark:text-white">1.245</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                <span>Concluídos no mês:</span>
                <span className="font-bold text-slate-900 dark:text-white">328</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 pt-2">
            <Button
              variant="default"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleExportPDF}
            >
              <Download className="h-4 w-4 mr-2" /> Exportar PDF
            </Button>
            <Button variant="outline" size="icon" onClick={handleExportCSV} title="Exportar CSV">
              <FileText className="h-4 w-4 text-slate-500" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-t-4 border-t-orange-500">
          <CardHeader>
            <PieChart className="h-8 w-8 text-orange-500 mb-2" />
            <CardTitle>Resumo Financeiro</CardTitle>
            <CardDescription>
              Relatórios de receita, vendas de cursos e métricas de assinaturas no período.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                <span>Receita Mensal:</span>
                <span className="font-bold text-slate-900 dark:text-white">R$ 45.230</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                <span>Crescimento:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+12.5%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 pt-2">
            <Button
              variant="default"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleExportPDF}
            >
              <Download className="h-4 w-4 mr-2" /> Exportar PDF
            </Button>
            <Button variant="outline" size="icon" onClick={handleExportCSV} title="Exportar CSV">
              <FileText className="h-4 w-4 text-slate-500" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-t-4 border-t-emerald-500 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <BarChart className="h-8 w-8 text-emerald-500 mb-2" />
            <CardTitle>Desempenho da Plataforma</CardTitle>
            <CardDescription>
              Estatísticas de uso do sistema, usuários ativos e métricas de engajamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                <span>Tempo Médio (Sessão):</span>
                <span className="font-bold text-slate-900 dark:text-white">24m 12s</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded">
                <span>Usuários Diários:</span>
                <span className="font-bold text-slate-900 dark:text-white">8.432</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 pt-2">
            <Button
              variant="default"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleExportPDF}
            >
              <Download className="h-4 w-4 mr-2" /> Exportar PDF
            </Button>
            <Button variant="outline" size="icon" onClick={handleExportCSV} title="Exportar CSV">
              <FileText className="h-4 w-4 text-slate-500" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center mt-8">
        <Logo
          className="h-16 mb-6 opacity-70 grayscale hover:grayscale-0 transition-all duration-500"
          linkTo="#"
        />
        <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">
          Motor de Exportação Oficial
        </h3>
        <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">
          Todos os documentos PDF exportados através desta central incluem automaticamente o novo
          cabeçalho oficial, garantindo o alinhamento total da marca com a identidade visual da
          Observatório Academy.
        </p>
      </div>
    </div>
  )
}
