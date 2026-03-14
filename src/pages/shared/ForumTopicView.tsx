import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLmsStore } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { PublicHeader } from '@/components/PublicHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, User, MessageSquare } from 'lucide-react'

export default function ForumTopicView() {
  const { topicId } = useParams()
  const { forumTopics, forumReplies, addForumReply, students, instructors } = useLmsStore()
  const user = useAuthStore((s) => s.user)
  const [replyText, setReplyText] = useState('')

  const topic = forumTopics.find((t) => t.id === topicId)
  const replies = forumReplies
    .filter((r) => r.topicId === topicId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  if (!topic) return <div className="p-8 text-center font-bold">Tópico não encontrado.</div>

  const allUsers = [
    ...students,
    ...instructors,
    { id: 'm1', name: 'Admin Gestor', role: 'manager', avatar: '' },
  ]
  const getAuthor = (id: string) => allUsers.find((u) => u.id === id)

  const handleReply = () => {
    if (!replyText.trim() || !user) return
    addForumReply({
      id: `fr_${Date.now()}`,
      topicId: topic.id,
      authorId: user.id,
      content: replyText,
      createdAt: new Date().toISOString(),
    })
    setReplyText('')
  }

  const topicAuthor = getAuthor(topic.authorId)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <PublicHeader />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6 font-bold text-brand">
          <Link to={`/forum/${topic.forumId}`}>
            <ArrowLeft className="mr-2 size-4" /> Voltar aos Tópicos
          </Link>
        </Button>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8 text-brand dark:text-white leading-tight">
          {topic.title}
        </h1>

        <div className="space-y-6">
          <Card className="border-l-4 border-l-primary shadow-md border-y-slate-200 border-r-slate-200 dark:border-y-slate-800 dark:border-r-slate-800">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center border shadow-sm">
                  <User className="size-6 text-slate-500" />
                </div>
                <div>
                  <div className="font-bold text-foreground text-lg">
                    {topicAuthor?.name || 'Usuário'}
                  </div>
                  <div className="text-sm font-medium text-slate-500">
                    {new Date(topic.createdAt).toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
              <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-medium leading-relaxed text-base">
                {topic.content}
              </div>
            </CardContent>
          </Card>

          <div className="pl-4 md:pl-8 space-y-6 pt-6 border-l-2 border-slate-200 dark:border-slate-800 ml-2 md:ml-6">
            {replies.map((reply) => {
              const replyAuthor = getAuthor(reply.authorId)
              return (
                <Card key={reply.id} className="shadow-sm border-slate-200 dark:border-slate-800">
                  <CardContent className="p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center border shadow-sm">
                        <User className="size-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-bold text-base text-foreground flex items-center gap-2">
                          {replyAuthor?.name || 'Usuário'}
                          {replyAuthor?.role === 'instructor' && (
                            <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded uppercase font-black tracking-widest">
                              Professor
                            </span>
                          )}
                          {replyAuthor?.role === 'manager' && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded uppercase font-black tracking-widest">
                              Gestão
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-medium text-slate-500">
                          {new Date(reply.createdAt).toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 text-base font-medium whitespace-pre-wrap leading-relaxed">
                      {reply.content}
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {user ? (
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-brand dark:text-white">
                  <MessageSquare className="size-5 text-primary" /> Deixe sua resposta
                </h3>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escreva aqui sua contribuição..."
                  className="min-h-[150px] mb-4 text-base p-4"
                />
                <Button onClick={handleReply} size="lg" className="font-bold shadow-md">
                  Enviar Resposta
                </Button>
              </div>
            ) : (
              <div className="bg-muted/50 p-8 rounded-xl text-center border-2 border-dashed border-slate-300 dark:border-slate-700 mt-8">
                <MessageSquare className="size-8 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-4">
                  Para interagir e responder a este tópico, você precisa acessar sua conta.
                </p>
                <Button asChild className="font-bold shadow-sm">
                  <Link to="/login">Fazer Login Agora</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
