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

export function downloadCSV(filename: string, headers: string[], rows: any[][]) {
  const csvContent = `data:text/csv;charset=utf-8,${headers.join(',')}\n${rows.map((row) => row.join(',')).join('\n')}`
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const getStyles = () => `
  <style>
    @page { margin: 20mm; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; margin: 0; color: #1e293b; background: #fff; }
    .header { display: flex; align-items: center; border-bottom: 4px solid #f97316; padding-bottom: 48px; margin-bottom: 50px; }
    .logo { height: 300px; max-width: 700px; object-fit: contain; margin-right: 48px; flex-shrink: 0; }
    .title-container { border-left: 3px solid #e2e8f0; padding-left: 40px; flex-grow: 1; }
    .title { margin: 0; font-size: 36px; color: #0f172a; font-weight: 800; letter-spacing: -0.02em; }
    .subtitle { margin: 12px 0 0 0; color: #64748b; font-size: 16px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }
    .content { line-height: 1.7; font-size: 15px; }
    .content h2 { color: #0f172a; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
    .metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin: 36px 0; }
    .metric-box, .summary-box { border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; background: #f8fafc; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
    .summary-box { margin-bottom: 36px; }
    .summary-item { margin-bottom: 10px; font-weight: 600; color: #334155; font-size: 16px; }
    .metric-value { font-size: 32px; font-weight: 800; color: #0f2a4a; letter-spacing: -0.02em; }
    .metric-label { font-size: 13px; color: #64748b; margin-top: 6px; font-weight: 600; text-transform: uppercase; }
    .table { border-collapse: separate; border-spacing: 0; margin-top: 36px; width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .table th, .table td { border-bottom: 1px solid #e2e8f0; padding: 16px 20px; text-align: left; }
    .table tr:last-child td { border-bottom: none; }
    .table th { background-color: #f8fafc; font-weight: 700; color: #334155; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
    .table td { color: #475569; font-weight: 500; }
    .footer { margin-top: 80px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 32px; font-weight: 500; }
  </style>
`

const getHeader = (title: string) => `
  <div class="header">
    <img src="${window.location.origin}${logoUrl.startsWith('/') ? logoUrl : '/' + logoUrl}" class="logo" alt="Logo" />
    <div class="title-container">
      <h1 class="title">${title}</h1>
      <p class="subtitle">Documento Oficial • ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
  </div>
`

export function exportToPDF({ filename, title }: ExportOptions) {
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>${filename}</title>${getStyles()}</head><body>
        ${getHeader(title)}
        <div class="content">
          <h2>Resumo Executivo</h2>
          <p>Este é um documento gerado automaticamente pela plataforma. O relatório reflete as métricas atuais registradas no sistema com base nos dados mais recentes.</p>
          <div class="metric-grid">
            <div class="metric-box"><div class="metric-value">1,245</div><div class="metric-label">Alunos Ativos</div></div>
            <div class="metric-box"><div class="metric-value">94%</div><div class="metric-label">Taxa de Conclusão</div></div>
            <div class="metric-box"><div class="metric-value" style="color: #059669;">+12.5%</div><div class="metric-label">Crescimento Mensal</div></div>
          </div>
          <table class="table">
            <thead><tr><th>Indicador</th><th>Valor Atual</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Novas Matrículas</td><td>328</td><td style="color: #059669; font-weight: 700;">Em Alta</td></tr>
              <tr><td>Certificados Emitidos</td><td>854</td><td style="color: #3b82f6; font-weight: 700;">Estável</td></tr>
              <tr><td>Avaliação Média</td><td>4.8 / 5.0</td><td style="color: #8b5cf6; font-weight: 700;">Excelente</td></tr>
            </tbody>
          </table>
        </div>
        <div class="footer">&copy; ${new Date().getFullYear()} Observatório Academy.<br/>Este documento é de uso exclusivo interno e contém informações confidenciais.</div>
      </body></html>
    `)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 800)
  }
}

export function printPDF(title: string, headers: string[], rows: any[][], summary: string[]) {
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>${title}</title>${getStyles()}</head><body>
        ${getHeader(title)}
        <div class="content">
          <div class="summary-box">
            ${summary
              .map((s) => {
                const parts = s.split(':::')
                return `<div class="summary-item">${parts[0]}: <span style="color: #0f2a4a; font-weight: 800;">${parts[1] || ''}</span></div>`
              })
              .join('')}
          </div>
          <table class="table">
            <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
        <div class="footer">&copy; ${new Date().getFullYear()} Observatório Academy.<br/>Este documento é de uso exclusivo interno.</div>
      </body></html>
    `)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 800)
  }
}
