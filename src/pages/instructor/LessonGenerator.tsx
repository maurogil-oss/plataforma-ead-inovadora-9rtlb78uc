import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Bot, WandSparkles, Loader2, Copy, CheckCircle2 } from 'lucide-react'

export default function LessonGenerator() {
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('Iniciantes')
  const [duration, setDuration] = useState('15')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    if (!topic) return
    setLoading(true)
    setResult('')

    // Simulate AI generation delay
    setTimeout(() => {
      setResult(`**Plano de Aula: ${topic}**
*Público-alvo: ${audience} | Duração estimada: ${duration} minutos*

---

**1. Introdução (2 min)**
- Boas-vindas e apresentação do instrutor.
- Gancho (Hook): Uma pergunta provocativa ou curiosidade sobre o tema.
- Objetivo da aula: O que o aluno será capaz de fazer ao final?

**2. Desenvolvimento Teórico (5 min)**
- Apresentar o conceito principal de forma clara e objetiva.
- Utilizar analogias do dia a dia para facilitar a compreensão.
- Destacar 3 pontos-chave fundamentais sobre o tema.

**3. Demonstração Prática / Estudo de Caso (5 min)**
- Mostrar como o conceito se aplica na prática.
- Passo a passo de uma resolução de problema ou aplicação.
- Compartilhar a tela ou usar recursos visuais para ilustrar.

**4. Dicas e Melhores Práticas (2 min)**
- Erros comuns a evitar.
- Atalhos ou ferramentas úteis relacionadas ao tema.

**5. Encerramento e CTA (1 min)**
- Recapitulação rápida dos pontos principais.
- Chamada para ação (CTA): Exercício prático, leitura de PDF complementar ou participar do fórum.
- Despedida.

---
*Dica de Gravação:* Mantenha contato visual com a câmera, use um tom de voz dinâmico e lembre-se de sorrir!`)
      setLoading(false)
    }, 2500)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Bot className="size-8 text-primary" /> Gerador de Roteiros com IA
        </h1>
        <p className="text-muted-foreground mt-1">
          Crie planos de aula estruturados em segundos para facilitar sua gravação.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações da Aula</CardTitle>
              <CardDescription>Forneça os detalhes para a IA criar o roteiro.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tópico Principal</Label>
                <Textarea
                  placeholder="Ex: Como gerenciar conflitos em equipes remotas"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Público-alvo</Label>
                <Input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Ex: Líderes iniciantes"
                />
              </div>
              <div className="space-y-2">
                <Label>Duração do Vídeo (minutos)</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="15"
                />
              </div>
              <Button
                className="w-full mt-2"
                size="lg"
                onClick={handleGenerate}
                disabled={!topic || loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 size-5 animate-spin" />
                ) : (
                  <WandSparkles className="mr-2 size-5" />
                )}
                {loading ? 'Gerando Roteiro...' : 'Gerar Roteiro'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-7">
          <Card className="h-full min-h-[500px] flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center border-b pb-4 bg-muted/20">
              <CardTitle className="text-lg">Resultado Gerado</CardTitle>
              {result && (
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <CheckCircle2 className="mr-2 size-4 text-success" />
                  ) : (
                    <Copy className="mr-2 size-4" />
                  )}
                  {copied ? 'Copiado!' : 'Copiar Texto'}
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6 flex-1 overflow-auto bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-300">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground opacity-60">
                  <Bot className="size-12 animate-pulse" />
                  <p>A Inteligência Artificial está escrevendo seu roteiro...</p>
                </div>
              ) : result ? (
                <div className="whitespace-pre-wrap font-sans leading-relaxed">{result}</div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground opacity-40">
                  <WandSparkles className="size-16" />
                  <p className="text-center max-w-xs">
                    Preencha as informações ao lado e clique em gerar para ver a mágica acontecer.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
