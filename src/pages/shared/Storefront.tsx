import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCommercialStore } from '@/stores/commercialStore'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Rocket } from 'lucide-react'

const categories = [
  { id: 'all', label: 'Todos' },
  { id: 'ebook', label: 'eBooks' },
  { id: 'course', label: 'Cursos' },
  { id: 'expansion1', label: 'Future Products 1 (Em Breve)' },
  { id: 'expansion2', label: 'Future Products 2 (Em Breve)' },
  { id: 'expansion3', label: 'Future Products 3 (Em Breve)' },
  { id: 'expansion4', label: 'Future Products 4 (Em Breve)' },
  { id: 'expansion5', label: 'Future Products 5 (Em Breve)' },
]

export default function Storefront() {
  const { products } = useCommercialStore()
  const [activeTab, setActiveTab] = useState('all')

  const publishedProducts = products.filter((p) => p.isPublished)
  const filteredProducts =
    activeTab === 'all' ? publishedProducts : publishedProducts.filter((p) => p.type === activeTab)

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Loja / Marketplace</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Explore nossos e-books, cursos e conteúdos exclusivos.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start mb-8">
          {categories.map((c) => (
            <TabsTrigger
              key={c.id}
              value={c.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-card px-4 py-2 shadow-sm"
            >
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0 outline-none">
          {filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <Card
                  key={p.id}
                  className="overflow-hidden flex flex-col hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-border/50"
                >
                  <div className="h-48 relative bg-muted">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <Badge className="absolute top-3 left-3 bg-background/90 text-foreground border-none shadow-sm backdrop-blur-sm font-semibold uppercase tracking-wider text-[10px]">
                      {categories.find((c) => c.id === p.type)?.label || p.type}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2 leading-tight">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {p.description}
                    </p>
                    <div className="flex flex-col">
                      {p.promotionalPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-extrabold text-primary">
                            R$ {p.promotionalPrice.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            R$ {p.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-extrabold text-primary">
                          R$ {p.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 border-t p-4 bg-muted/10 mt-auto">
                    <Button className="w-full" asChild>
                      <Link to={`/store/product/${p.id}`}>Ver Detalhes</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
              <Rocket className="mx-auto size-12 text-muted-foreground opacity-30 mb-4" />
              <h3 className="text-xl font-bold text-foreground">Novidades em Breve!</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Estamos preparando conteúdos incríveis para esta categoria. Fique de olho e
                acompanhe as próximas atualizações da plataforma.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
