import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useLmsStore } from '@/stores/lmsStore'
import { toast } from 'sonner'
import { Palette, Save } from 'lucide-react'

export default function AppearanceSettings() {
  const { themeSettings, updateThemeSettings } = useLmsStore()
  const [arrowColor, setArrowColor] = useState(themeSettings.carouselArrowColor)

  const handleSave = () => {
    updateThemeSettings({ ...themeSettings, carouselArrowColor: arrowColor })
    toast.success('Configurações de aparência salvas com sucesso!')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-brand">Aparência e Personalização</h1>
        <p className="text-muted-foreground mt-1">
          Customize a identidade visual da plataforma para combinar com sua marca.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Cores dos Componentes
          </CardTitle>
          <CardDescription>
            Defina as cores principais para elementos de navegação e destaque visual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Cor das Setas do Carrossel</Label>
            <div className="flex items-center gap-4">
              <Input
                type="color"
                value={arrowColor}
                onChange={(e) => setArrowColor(e.target.value)}
                className="w-20 h-14 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={arrowColor}
                onChange={(e) => setArrowColor(e.target.value)}
                className="w-32 uppercase font-mono"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Esta cor será aplicada aos ícones de navegação (setas) em todos os carrosséis da
              plataforma, mantendo a consistência com a sua identidade visual.
            </p>
          </div>

          <Button onClick={handleSave} className="mt-4">
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
