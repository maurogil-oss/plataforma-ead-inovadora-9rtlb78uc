import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Mail, Save, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Logo } from '@/components/Logo'

export default function NotificationSettings() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const [templates, setTemplates] = useState({
    welcome: {
      subject: 'Bem-vindo ao Observatório Academy (DEMO)!',
      body: 'Olá {{nome}},\n\nÉ com grande satisfação que damos as boas-vindas ao Observatório Academy (DEMO). Estamos felizes em tê-lo conosco.\n\nAcesse sua conta para começar sua jornada de aprendizado e explorar nosso catálogo exclusivo.\n\nAtenciosamente,\nEquipe Observatório Academy (DEMO)',
      active: true,
    },
    recovery: {
      subject: 'Recuperação de Senha - Observatório Academy (DEMO)',
      body: 'Olá {{nome}},\n\nRecebemos uma solicitação para redefinir sua senha de acesso no Observatório Academy (DEMO).\n\nClique no botão abaixo para criar uma nova senha. Se você não fez essa solicitação, pode ignorar este email de segurança.\n\nAtenciosamente,\nEquipe de Segurança - Observatório Academy (DEMO)',
      active: true,
    },
    commission: {
      subject: 'Nova Comissão Recebida! - Observatório Academy (DEMO)',
      body: 'Olá {{nome}},\n\nParabéns! Você acaba de receber uma nova comissão de afiliado/parceiro no Observatório Academy (DEMO).\n\nValor: {{valor}}\nProduto: {{produto}}\n\nContinue o ótimo trabalho e alavanque seus ganhos!\n\nAtenciosamente,\nEquipe Financeira - Observatório Academy (DEMO)',
      active: true,
    },
  })

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast({
        title: 'Templates atualizados com sucesso',
        description: 'As configurações de comunicação do Observatório Academy (DEMO) foram salvas.',
      })
    }, 800)
  }

  const updateTemplate = (key: keyof typeof templates, field: string, value: string | boolean) => {
    setTemplates((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }

  const EmailPreview = ({ templateKey }: { templateKey: keyof typeof templates }) => {
    const template = templates[templateKey]

    return (
      <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col bg-slate-100 mt-8 shadow-inner">
        <div className="bg-slate-200 px-4 py-3 border-b border-slate-300 flex items-center justify-between text-sm text-slate-700 font-medium">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Pré-visualização do Email para o Usuário</span>
          </div>
          <span className="text-xs bg-white px-2 py-1 rounded shadow-sm">Desktop</span>
        </div>
        <div className="p-8 md:p-12 bg-slate-50 flex-1">
          <div className="bg-white max-w-2xl mx-auto w-full rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="text-center p-8 bg-brand border-b border-slate-100 flex justify-center">
              <Logo className="h-14 w-auto text-white" />
            </div>
            <div className="p-8 space-y-6 text-slate-800">
              <h2 className="text-2xl font-bold border-b border-slate-100 pb-4 text-brand">
                {template.subject}
              </h2>
              <div className="whitespace-pre-wrap font-sans text-base leading-relaxed text-slate-700">
                {template.body
                  .replace('{{nome}}', 'João Silva')
                  .replace('{{valor}}', 'R$ 150,00')
                  .replace('{{produto}}', 'Curso Especialização em Frontend')}
              </div>

              {templateKey === 'recovery' && (
                <div className="mt-8 text-center pt-4">
                  <Button className="h-12 px-8 text-base font-bold shadow-md">
                    Redefinir Minha Senha
                  </Button>
                </div>
              )}
              {templateKey === 'welcome' && (
                <div className="mt-8 text-center pt-4">
                  <Button className="h-12 px-8 text-base font-bold shadow-md">
                    Acessar Plataforma
                  </Button>
                </div>
              )}
            </div>
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
              <p className="font-medium">
                © {new Date().getFullYear()} Observatório Academy (DEMO). Todos os direitos
                reservados.
              </p>
              <p>
                Você está recebendo este email pois está cadastrado em nossa plataforma educacional.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand">Comunicações e Emails</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os templates de email enviados pelo Observatório Academy (DEMO).
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Salvando Alterações...' : 'Salvar Alterações'}
        </Button>
      </div>

      <Tabs defaultValue="welcome" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto gap-2 bg-transparent">
          <TabsTrigger
            value="welcome"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-white shadow-sm py-3 font-semibold"
          >
            Boas-vindas
          </TabsTrigger>
          <TabsTrigger
            value="recovery"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-white shadow-sm py-3 font-semibold"
          >
            Recuperação de Senha
          </TabsTrigger>
          <TabsTrigger
            value="commission"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-white shadow-sm py-3 font-semibold"
          >
            Notificação de Comissão
          </TabsTrigger>
        </TabsList>

        {(Object.keys(templates) as Array<keyof typeof templates>).map((key) => (
          <TabsContent value={key} key={key} className="mt-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50 rounded-t-xl pb-6">
                <div>
                  <CardTitle className="text-xl text-brand">
                    {key === 'welcome' && 'Email de Boas-vindas a Novos Usuários'}
                    {key === 'recovery' && 'Email de Recuperação de Senha Segura'}
                    {key === 'commission' && 'Email de Aviso de Nova Comissão'}
                  </CardTitle>
                  <CardDescription className="mt-1.5 text-base font-medium">
                    Configure como este email será enviado com a identidade do Observatório Academy
                    (DEMO).
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg border shadow-sm">
                  <Switch
                    id={`${key}-active`}
                    checked={templates[key].active}
                    onCheckedChange={(c) => updateTemplate(key, 'active', c)}
                  />
                  <Label htmlFor={`${key}-active`} className="font-semibold cursor-pointer">
                    Template Ativo
                  </Label>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-8">
                <div className="space-y-3">
                  <Label className="text-base font-bold text-brand">Assunto do Email</Label>
                  <Input
                    value={templates[key].subject}
                    onChange={(e) => updateTemplate(key, 'subject', e.target.value)}
                    className="text-base py-6 font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <Label className="text-base font-bold text-brand">Corpo do Email</Label>
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 font-semibold">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Não remova as variáveis em {'{{ chaves }}'}</span>
                    </div>
                  </div>
                  <Textarea
                    className="min-h-[250px] font-mono text-sm leading-relaxed"
                    value={templates[key].body}
                    onChange={(e) => updateTemplate(key, 'body', e.target.value)}
                  />
                  <p className="text-sm text-slate-500 font-medium">
                    Variáveis disponíveis para uso no texto:{' '}
                    <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-bold">
                      {'{{nome}}'}
                    </code>
                    {key === 'commission' && (
                      <>
                        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 ml-1 font-bold">
                          {'{{valor}}'}
                        </code>{' '}
                        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 ml-1 font-bold">
                          {'{{produto}}'}
                        </code>
                      </>
                    )}
                  </p>
                </div>

                <EmailPreview templateKey={key} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
