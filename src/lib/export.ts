export function downloadCSV(filename: string, headers: string[], rows: any[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          if (cell === null || cell === undefined) return '""'
          return `"${String(cell).replace(/"/g, '""')}"`
        })
        .join(','),
    ),
  ].join('\n')

  const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
    type: 'text/csv;charset=utf-8;',
  }) // Added BOM for UTF-8 Excel compatibility
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function printPDF(title: string, headers: string[], rows: any[][], summary?: string[]) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>${title} - Exportação</title>
      <style>
        body { font-family: 'Inter', 'Segoe UI', Roboto, sans-serif; color: #334155; margin: 40px; }
        .header { border-bottom: 4px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
        .brand { color: #004b87; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
        .brand-sub { color: #f97316; font-size: 13px; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px; }
        .title { font-size: 20px; color: #0f172a; margin: 0; font-weight: 700; }
        .date { font-size: 12px; color: #64748b; margin-top: 6px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px; }
        th { background-color: #f1f5f9; color: #004b87; font-weight: 700; text-align: left; padding: 12px; border-bottom: 2px solid #cbd5e1; }
        td { padding: 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .summary { display: flex; gap: 16px; margin-bottom: 30px; flex-wrap: wrap; }
        .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; flex: 1; min-width: 200px; }
        .summary-title { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; }
        .summary-value { font-size: 20px; color: #004b87; font-weight: 800; margin-top: 6px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">Observatório Academy</div>
          <div class="brand-sub">Sistema de Relatórios ONSV</div>
        </div>
        <div style="text-align: right;">
          <div class="title">${title}</div>
          <div class="date">Gerado em: ${new Date().toLocaleString('pt-BR')}</div>
        </div>
      </div>

      ${
        summary && summary.length > 0
          ? `
        <div class="summary">
          ${summary
            .map((s) => {
              const [k, v] = s.split(':::') // Use ':::' as internal separator
              return `
              <div class="summary-card">
                <div class="summary-title">${k}</div>
                <div class="summary-value">${v}</div>
              </div>
            `
            })
            .join('')}
        </div>
      `
          : ''
      }

      <table>
        <thead>
          <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (r) =>
                `<tr>${r.map((c) => `<td>${c !== undefined && c !== null ? c : '-'}</td>`).join('')}</tr>`,
            )
            .join('')}
        </tbody>
      </table>
      
      <div class="footer">
        Documento gerado automaticamente pela plataforma Observatório Academy. Uso interno e exclusivo.
      </div>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()

  setTimeout(() => {
    printWindow.focus()
    printWindow.print()
  }, 250)
}
