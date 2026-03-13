import { MessageSquare, ThumbsUp, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MOCK_POSTS } from '@/data/mock'

export default function Community() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-primary/10 border border-primary/20 p-6 rounded-2xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Comunidade Segura</h1>
          <p className="text-muted-foreground mt-1">
            Compartilhe dicas, tire dúvidas e conecte-se com outros motoristas.
          </p>
        </div>
        <Button className="shrink-0 shadow-glow">
          <Plus className="mr-2 size-4" /> Novo Tópico
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Todos', 'Direção Defensiva', 'Legislação', 'Dicas Práticas', 'Mecânica'].map(
          (cat, i) => (
            <Badge
              key={cat}
              variant={i === 0 ? 'default' : 'secondary'}
              className="px-4 py-1.5 text-sm cursor-pointer whitespace-nowrap"
            >
              {cat}
            </Badge>
          ),
        )}
      </div>

      <div className="space-y-4">
        {MOCK_POSTS.map((post) => (
          <Card key={post.id} className="glass-card hover:border-white/20 transition-colors">
            <CardContent className="p-4 sm:p-6 flex gap-4">
              {/* Upvote Column */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:text-success hover:bg-success/10"
                >
                  <ThumbsUp className="size-4" />
                </Button>
                <span className="font-bold text-sm">{post.upvotes}</span>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2 min-w-0">
                <h3 className="font-bold text-lg hover:text-primary cursor-pointer transition-colors truncate">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{post.content}</p>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6 border border-white/10">
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <MessageSquare className="size-3.5" /> {post.replies} Respostas
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
