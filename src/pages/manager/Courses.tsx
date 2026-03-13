import { Link } from 'react-router-dom'
import { useLmsStore } from '@/stores/lmsStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Plus, Edit, Trash2, Layers } from 'lucide-react'

export default function ManagerCourses() {
  const courses = useLmsStore((s) => s.courses)
  const deleteCourse = useLmsStore((s) => s.deleteCourse)

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Cursos</h1>
          <p className="text-muted-foreground mt-1">Crie e edite os conteúdos do catálogo.</p>
        </div>
        <Button asChild className="shrink-0 shadow-sm">
          <Link to="/manager/courses/new">
            <Plus className="mr-2 size-4" /> Novo Curso
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)

          return (
            <Card key={course.id} className="flex flex-col overflow-hidden">
              <div className="h-32 bg-muted relative">
                <img
                  src={course.thumbnail}
                  className="w-full h-full object-cover opacity-80"
                  alt=""
                />
                <div className="absolute top-3 left-3 bg-background/90 text-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {course.area}
                </div>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg line-clamp-2 leading-snug">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <div className="flex items-center gap-1.5">
                    <Layers className="size-4" />
                    {course.modules.length} Módulos
                  </div>
                  <div>•</div>
                  <div>{totalLessons} Aulas</div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-end gap-2 border-t p-4 bg-muted/20 mt-auto">
                <Button variant="outline" size="sm" asChild className="bg-background">
                  <Link to={`/manager/courses/${course.id}/edit`}>
                    <Edit className="size-4 mr-2" /> Editar
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="size-8"
                  onClick={() => {
                    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
                      deleteCourse(course.id)
                    }
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardFooter>
            </Card>
          )
        })}

        {courses.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
            <p>Nenhum curso cadastrado ainda.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/manager/courses/new">Criar o Primeiro Curso</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
