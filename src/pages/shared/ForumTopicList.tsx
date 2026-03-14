import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLmsStore } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { PublicHeader } from '@/components/PublicHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare, ArrowLeft, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function ForumTopicList() {
  const { forumId } = useParams()
  const { courses, forumTopics, addForumTopic, students, instructors } = useLmsStore()
  const user = useAuthStore((s) => s.user)

  const [openNew, setOpenNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')

  const course = courses.find((c) => c.id === forumId)
  const title = forumId === 'general' ? 'Fórum Geral' : course?.title || 'Fórum Desconhecido'

  const topics = forumTopics
    .filter((t) => t.forumId === forumId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleCreate = () => {
    if (!newTitle || !newContent || !user) return
    addForumTopic({
      id: `t_${Date.now()}`,
      forumId: forumId!,
      authorId: user.id,
      title: newTitle,
      content: newContent,
      createdAt: new Date().toISOString(),
      replies: 0,
    })
    setOpenNew(false)
    setNewTitle('')
    setNewContent('')
  }

  const allUsers = [
    ...students,
    ...instructors,
    { id: 'm1', name: 'Admin Gestor', role: 'manager', avatar: '' },
  ]
  const getAuthorName = (id: string) => allUsers.find((u) => u.id === id)?.name || 'Usuário'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <PublicHeader />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" asChild className="mb-4 text-brand font-bold">
          <Link to="/forum">
            <ArrowLeft className="mr-2 size-4" /> Voltar aos Fóruns
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-brand dark:text-white">
              {title}
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Tópicos e discussões da comunidade.</p>
          </div>
          {user && (
            <Button onClick={() => setOpenNew(true)} className="font-bold shadow-md">
              <Plus className="mr-2 size-4" /> Novo Tópico
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {topics.map((topic) => (
            <Card
              key={topic.id}
              className="hover:shadow-sm transition-shadow border-slate-200 dark:border-slate-800"
            >
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-primary/10 p-2.5 rounded-full text-primary shrink-0 shadow-sm border border-primary/20">
                    <MessageSquare className="size-5" />
                  </div>
                  <div>
                    <Link
                      to={`/forum/topic/${topic.id}`}
                      className="text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {topic.title}
                    </Link>
                    <div className="text-sm text-slate-500 mt-1.5 flex items-center gap-2 font-medium">
                      <span>
                        Por{' '}
                        <strong className="text-slate-700 dark:text-slate-300">
                          {getAuthorName(topic.authorId)}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>{new Date(topic.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-center shrink-0 px-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg py-2 border border-slate-200 dark:border-slate-700">
                  <div className="text-xl font-black text-slate-700 dark:text-slate-300 leading-none">
                    {topic.replies}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1.5">
                    Respostas
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {topics.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <MessageSquare className="size-12 mx-auto text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-600">Nenhum tópico criado ainda.</p>
              {user ? (
                <Button variant="link" className="font-bold mt-2" onClick={() => setOpenNew(true)}>
                  Seja o primeiro a publicar
                </Button>
              ) : (
                <p className="text-sm text-slate-500 mt-2 font-medium">
                  Faça login para participar.
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-brand">Criar Novo Tópico</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <Input
              placeholder="Título da discussão"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="font-bold text-lg h-12"
            />
            <Textarea
              placeholder="Escreva os detalhes da sua dúvida ou ideia..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="min-h-[200px] text-base leading-relaxed p-4"
            />
            <Button size="lg" className="w-full font-bold shadow-md" onClick={handleCreate}>
              Publicar Tópico
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
