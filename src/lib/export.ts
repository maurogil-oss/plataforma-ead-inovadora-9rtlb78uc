import logoUrl from '@/assets/logomarca-observatorio-academy-nova-86843.png'

interface ExportOptions {
  filename: string
  title: string
  data?: any[]
}

export function exportToCSV({ filename, data }: ExportOptions) {
  if (!data || !data.length) return
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map((obj) => Object.values(obj).join(',')).join('\n')
  const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToPDF({ filename, title }: ExportOptions) {
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            @page { margin: 20mm; }
            body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 0; margin: 0; color: #1e293b; }
            .header { display: flex; align-items: center; border-bottom: 3px solid #f97316; padding-bottom: 24px; margin-bottom: 32px; }
            .logo { height: 70px; object-fit: contain; margin-right: 24px; }
            .title-container { border-left: 2px solid #e2e8f0; padding-left: 24px; }
            .title { margin: 0; font-size: 26px; color: #0f172a; font-weight: 700; }
            .subtitle { margin: 6px 0 0 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
            .content { line-height: 1.7; font-size: 14px; }
            .metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0; }
            .metric-box { border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; background: #f8fafc; }
            .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
            .metric-label { font-size: 12px; color: #64748b; margin-top: 4px; }
            .table { border-collapse: collapse; margin-top: 30px; width: 100%; }
            .table th, .table td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            .table th { background-color: #f1f5f9; color: #334155; font-weight: 600; }
            .footer { margin-top: 60px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 24px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${window.location.origin}${logoUrl.startsWith('/') ? logoUrl : '/' + logoUrl}" class="logo" alt="Observatório Academy" />
            <div class="title-container">
              <h1 class="title">${title}</h1>
              <p class="subtitle">Documento Oficial • ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          <div class="content">
            <h2>Resumo Executivo</h2>
            <p>Este é um documento gerado automaticamente pela plataforma Observatório Academy. O relatório reflete as métricas atuais registradas no sistema de gestão acadêmica e financeira.</p>
            
            <div class="metric-grid">
              <div class="metric-box">
                <div class="metric-value">1,245</div>
                <div class="metric-label">Alunos Ativos</div>
              </div>
              <div class="metric-box">
                <div class="metric-value">94%</div>
                <div class="metric-label">Taxa de Conclusão</div>
              </div>
              <div class="metric-box">
                <div class="metric-value">+12.5%</div>
                <div class="metric-label">Crescimento Mensal</div>
              </div>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>Valor Atual</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Novas Matrículas</td>
                  <td>328</td>
                  <td>Em Alta</td>
                </tr>
                <tr>
                  <td>Certificados Emitidos</td>
                  <td>854</td>
                  <td>Estável</td>
                </tr>
                <tr>
                  <td>Avaliação Média</td>
                  <td>4.8 / 5.0</td>
                  <td>Excelente</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Observatório Academy. Identidade visual atualizada.<br/>
            Este documento é de uso exclusivo interno.
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()

    // Auto print after logo loads
    setTimeout(() => {
      printWindow.print()
    }, 800)
  }
}
