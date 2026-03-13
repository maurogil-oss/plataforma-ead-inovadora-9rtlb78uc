import { useState } from 'react'
import { useLmsStore } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CheckCircle, MessageSquare } from 'lucide-react'

export function CourseForum({ lessonId }: { lessonId: string }) {
  const { forumQuestions, addForumQuestion, addForumReply, resolveForumQuestion, students } =
    useLmsStore()
  const user = useAuthStore((s) => s.user)
  const [newQ, setNewQ] = useState('')
  const [replyText, setReplyText] = useState<Record<string, string>>({})

  const questions = forumQuestions.filter((q) => q.lessonId === lessonId)

  const handlePostQ = () => {
    if (!newQ.trim() || !user) return
    addForumQuestion({
      id: `fq_${Date.now()}`,
      lessonId,
      studentId: user.id,
      text: newQ,
      createdAt: new Date().toISOString(),
      resolved: false,
      replies: [],
    })
    setNewQ('')
  }

  const handleReply = (qId: string) => {
    if (!replyText[qId]?.trim() || !user) return
    addForumReply(qId, {
      id: `fr_${Date.now()}`,
      userId: user.id,
      text: replyText[qId],
      createdAt: new Date().toISOString(),
    })
    setReplyText((prev) => ({ ...prev, [qId]: '' }))
  }

  return (
    <div className="space-y-8 py-6">
      <div className="bg-muted/20 p-6 rounded-xl border">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <MessageSquare className="size-5" /> Nova Dúvida
        </h3>
        <Textarea
          placeholder="Qual é a sua dúvida sobre esta aula?"
          value={newQ}
          onChange={(e) => setNewQ(e.target.value)}
          className="mb-4 bg-background"
        />
        <Button onClick={handlePostQ} disabled={!newQ.trim()}>
          Publicar Dúvida
        </Button>
      </div>

      <div className="space-y-6">
        {questions.map((q) => {
          const author = students.find((s) => s.id === q.studentId) || user
          return (
            <div key={q.id} className="border rounded-xl p-5 bg-card shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                  <Avatar className="size-10 border">
                    <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{author?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(q.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                {q.resolved ? (
                  <span className="flex items-center gap-1 text-success text-xs font-medium bg-success/10 px-2 py-1 rounded">
                    <CheckCircle className="size-3" /> Resolvida
                  </span>
                ) : (
                  user?.role === 'manager' && (
                    <Button variant="outline" size="sm" onClick={() => resolveForumQuestion(q.id)}>
                      Marcar Resolvida
                    </Button>
                  )
                )}
              </div>
              <p className="text-foreground leading-relaxed mb-6">{q.text}</p>
              <div className="space-y-4 pl-6 border-l-2 ml-4">
                {q.replies.map((r) => {
                  const replier =
                    students.find((s) => s.id === r.userId) || (user?.id === r.userId ? user : null)
                  return (
                    <div key={r.id} className="bg-muted/30 p-3 rounded-lg text-sm">
                      <p className="font-medium text-xs text-primary mb-1">{replier?.name}</p>
                      <p className="text-muted-foreground">{r.text}</p>
                    </div>
                  )
                })}
                <div className="flex gap-2 items-center mt-4">
                  <Textarea
                    placeholder="Escreva uma resposta..."
                    value={replyText[q.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [q.id]: e.target.value })}
                    className="min-h-[40px] h-10 resize-none bg-background py-2 text-sm"
                  />
                  <Button
                    onClick={() => handleReply(q.id)}
                    disabled={!replyText[q.id]?.trim()}
                    size="sm"
                    className="shrink-0 h-10"
                  >
                    Responder
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
        {questions.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma dúvida publicada ainda. Seja o primeiro a perguntar!
          </p>
        )}
      </div>
    </div>
  )
}
