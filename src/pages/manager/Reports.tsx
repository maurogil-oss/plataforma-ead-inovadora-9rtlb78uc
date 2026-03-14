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
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 bg-gradient-to-r from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-6 md:gap-8 w-full xl:w-auto">
          <div className="p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hidden sm:flex shrink-0 items-center justify-center">
            <Logo imgClassName="h-16 md:h-20 w-auto object-contain" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-brand dark:text-white flex items-center gap-3">
              <BarChart className="h-8 w-8 text-orange-500" />
              Central de Relatórios Analíticos
            </h2>
            <p className="text-base text-slate-500 mt-2 font-medium">
              Gere, visualize e exporte relatórios oficiais com a identidade atualizada da academia.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto shrink-0">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full sm:w-[240px] h-11 bg-white dark:bg-slate-900 text-base font-medium">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="academic">Relatório Acadêmico</SelectItem>
              <SelectItem value="financial">Relatório Financeiro</SelectItem>
              <SelectItem value="performance">Métricas de Desempenho</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto h-11 px-6 font-bold bg-white">
            <Filter className="h-4 w-4 mr-2" /> Filtros
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-300 border-t-[6px] border-t-blue-500">
          <CardHeader className="pb-4">
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <FileBarChart className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Progresso Acadêmico</CardTitle>
            <CardDescription className="text-sm font-medium">
              Visão geral detalhada de matrículas, conclusões de cursos e taxas de certificação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-[15px] text-slate-600 dark:text-slate-400 space-y-3 font-medium">
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100">
                <span>Alunos Ativos:</span>
                <span className="font-extrabold text-brand dark:text-white text-lg">1.245</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100">
                <span>Concluídos no mês:</span>
                <span className="font-extrabold text-brand dark:text-white text-lg">328</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3 pt-2">
            <Button
              variant="default"
              className="w-full bg-brand hover:bg-brand/90 text-white font-bold h-11"
              onClick={handleExportPDF}
            >
              <Download className="h-4 w-4 mr-2" /> Exportar PDF Oficial
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={handleExportCSV}
              title="Exportar CSV"
            >
              <FileText className="h-4 w-4 text-slate-500" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-t-[6px] border-t-orange-500">
          <CardHeader className="pb-4">
            <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
              <PieChart className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-xl">Resumo Financeiro</CardTitle>
            <CardDescription className="text-sm font-medium">
              Relatórios de receita, vendas de cursos e métricas de assinaturas no período.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-[15px] text-slate-600 dark:text-slate-400 space-y-3 font-medium">
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100">
                <span>Receita Mensal:</span>
                <span className="font-extrabold text-brand dark:text-white text-lg">R$ 45.230</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                <span className="text-emerald-700 dark:text-emerald-400">Crescimento:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg">
                  +12.5%
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3 pt-2">
            <Button
              variant="default"
              className="w-full bg-brand hover:bg-brand/90 text-white font-bold h-11"
              onClick={handleExportPDF}
            >
              <Download className="h-4 w-4 mr-2" /> Exportar PDF Oficial
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={handleExportCSV}
              title="Exportar CSV"
            >
              <FileText className="h-4 w-4 text-slate-500" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-t-[6px] border-t-emerald-500 md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-4">
            <div className="h-12 w-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
              <BarChart className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-xl">Desempenho da Plataforma</CardTitle>
            <CardDescription className="text-sm font-medium">
              Estatísticas de uso do sistema, usuários ativos e métricas de engajamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-[15px] text-slate-600 dark:text-slate-400 space-y-3 font-medium">
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100">
                <span>Tempo Médio (Sessão):</span>
                <span className="font-extrabold text-brand dark:text-white text-lg">24m 12s</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100">
                <span>Usuários Diários:</span>
                <span className="font-extrabold text-brand dark:text-white text-lg">8.432</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3 pt-2">
            <Button
              variant="default"
              className="w-full bg-brand hover:bg-brand/90 text-white font-bold h-11"
              onClick={handleExportPDF}
            >
              <Download className="h-4 w-4 mr-2" /> Exportar PDF Oficial
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={handleExportCSV}
              title="Exportar CSV"
            >
              <FileText className="h-4 w-4 text-slate-500" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-14 dark:border-slate-800 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center mt-12 shadow-sm">
        <Logo
          imgClassName="h-24 md:h-32 mb-8 opacity-90 hover:opacity-100 transition-all duration-500 object-contain drop-shadow-sm"
          linkTo="#"
        />
        <h3 className="text-2xl font-extrabold mb-4 text-brand dark:text-slate-200">
          Motor de Exportação Oficial
        </h3>
        <p className="text-slate-500 max-w-3xl text-base leading-relaxed font-medium">
          Todos os documentos PDF exportados através desta central incluem automaticamente o novo
          cabeçalho oficial, garantindo o alinhamento total da marca com a identidade visual da
          Observatório Academy.
        </p>
      </div>
    </div>
  )
}
