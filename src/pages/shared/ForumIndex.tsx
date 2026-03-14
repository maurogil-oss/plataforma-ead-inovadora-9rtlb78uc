import { Link } from 'react-router-dom'
import { useLmsStore } from '@/stores/lmsStore'
import { PublicHeader } from '@/components/PublicHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Users, BookOpen } from 'lucide-react'

export default function ForumIndex() {
  const { courses, forumTopics } = useLmsStore()

  const getTopicCount = (forumId: string) => forumTopics.filter((t) => t.forumId === forumId).length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <PublicHeader />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-4xl font-extrabold mb-8 tracking-tight text-brand dark:text-white">
          Fórum da Comunidade
        </h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
              <Users className="text-primary size-6" /> Discussões Gerais
            </h2>
            <Card className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <Link
                    to="/forum/general"
                    className="text-xl font-bold text-primary hover:underline"
                  >
                    Fórum Geral
                  </Link>
                  <p className="text-slate-500 mt-1 font-medium">
                    Espaço aberto para discussões sobre Segurança Viária, Mobilidade e Cidades
                    Inteligentes.
                  </p>
                </div>
                <div className="text-center shrink-0 ml-4">
                  <div className="text-2xl font-black text-slate-700 dark:text-slate-300">
                    {getTopicCount('general')}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                    Tópicos
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
              <BookOpen className="text-primary size-6" /> Fóruns por Curso
            </h2>
            <div className="grid gap-4">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800"
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <Link
                        to={`/forum/${course.id}`}
                        className="text-lg md:text-xl font-bold text-primary hover:underline line-clamp-1"
                      >
                        {course.title}
                      </Link>
                      <p className="text-slate-500 mt-1 text-sm font-medium">
                        Dúvidas, materiais complementares e networking acadêmico exclusivo.
                      </p>
                    </div>
                    <div className="text-center shrink-0 ml-4">
                      <div className="text-2xl font-black text-slate-700 dark:text-slate-300">
                        {getTopicCount(course.id)}
                      </div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                        Tópicos
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
