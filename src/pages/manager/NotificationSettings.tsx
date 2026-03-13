import { useLmsStore } from '@/stores/lmsStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Mail, Bell } from 'lucide-react'

export default function NotificationSettings() {
  const { notificationSettings, updateNotificationSettings } = useLmsStore()

  return (
    <div className="space-y-8 max-w-2xl pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notificações Automáticas</h1>
        <p className="text-muted-foreground mt-1">
          Configure o envio de emails automáticos para os alunos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="size-5 text-primary" /> Disparos por Email
          </CardTitle>
          <CardDescription>
            Estes emails são enviados pelo sistema automaticamente baseados nos gatilhos abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-4 border-b pb-4">
            <div>
              <Label className="text-base font-semibold">Nova Aula Publicada</Label>
              <p className="text-sm text-muted-foreground">
                Notifica alunos matriculados quando um professor adicionar uma nova aula a um curso.
              </p>
            </div>
            <Switch
              checked={notificationSettings.emailNewLesson}
              onCheckedChange={(c) =>
                updateNotificationSettings({ ...notificationSettings, emailNewLesson: c })
              }
            />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div>
              <Label className="text-base font-semibold">Lembrete de Prazo de Prova</Label>
              <p className="text-sm text-muted-foreground">
                Envia avisos automáticos 48h e 24h antes do fechamento de uma turma ou exame.
              </p>
            </div>
            <Switch
              checked={notificationSettings.emailExamReminder}
              onCheckedChange={(c) =>
                updateNotificationSettings({ ...notificationSettings, emailExamReminder: c })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
