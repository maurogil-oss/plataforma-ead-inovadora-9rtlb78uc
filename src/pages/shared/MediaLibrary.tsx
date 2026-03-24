import { useState, useMemo } from 'react'
import { useLmsStore, MediaAsset, MediaType } from '@/stores/lmsStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  UploadCloud,
  Search,
  Trash2,
  Video,
  FileText,
  Image as ImageIcon,
  File,
  Eye,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const TypeIcon = ({ type, className }: { type: MediaType; className?: string }) => {
  switch (type) {
    case 'video':
      return <Video className={className} />
    case 'pdf':
      return <FileText className={className} />
    case 'image':
      return <ImageIcon className={className} />
    case 'document':
      return <File className={className} />
    default:
      return <File className={className} />
  }
}

export default function MediaLibrary() {
  const { mediaAssets, addMediaAsset, deleteMediaAsset, courses } = useLmsStore()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [newAsset, setNewAsset] = useState<Partial<MediaAsset>>({ type: 'video', tags: [] })
  const [tagInput, setTagInput] = useState('')

  const filteredAssets = useMemo(() => {
    return mediaAssets.filter((a) => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter !== 'all' && a.type !== typeFilter) return false
      return true
    })
  }, [mediaAssets, search, typeFilter])

  const getUsageCount = (assetId: string) => {
    return courses.reduce(
      (acc, c) =>
        acc +
        c.modules.reduce(
          (mAcc, m) => mAcc + m.lessons.filter((l) => l.assetId === assetId).length,
          0,
        ),
      0,
    )
  }

  const handleDelete = (asset: MediaAsset) => {
    const usageCount = getUsageCount(asset.id)
    if (usageCount > 0) {
      if (
        !window.confirm(
          `Atenção! Este arquivo está em uso em ${usageCount} aula(s). Se excluir, os links nas aulas serão quebrados. Deseja mesmo excluir?`,
        )
      )
        return
    } else {
      if (!window.confirm('Excluir permanentemente este arquivo?')) return
    }
    deleteMediaAsset(asset.id)
    toast.success('Arquivo removido da biblioteca.')
  }

  const handleMockUpload = () => {
    if (!newAsset.name) return toast.error('Dê um nome ao arquivo.')
    addMediaAsset({
      id: `a_${Date.now()}`,
      name: newAsset.name,
      type: (newAsset.type as MediaType) || 'video',
      url:
        newAsset.type === 'video'
          ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
          : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      tags: newAsset.tags || [],
      description: newAsset.description || '',
      uploadDate: new Date().toISOString(),
      sizeBytes: Math.floor(Math.random() * 10000000) + 1000000,
    })
    setUploadOpen(false)
    setNewAsset({ type: 'video', tags: [] })
    toast.success('Arquivo adicionado com sucesso!')
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand">Biblioteca de Arquivos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie vídeos, PDFs e documentos de forma centralizada.
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)} className="font-bold shadow-md">
          <UploadCloud className="mr-2 size-4" /> Novo Arquivo
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-9 h-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px] h-12">
            <SelectValue placeholder="Tipo de Arquivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="video">Vídeos</SelectItem>
            <SelectItem value="pdf">PDFs</SelectItem>
            <SelectItem value="image">Imagens</SelectItem>
            <SelectItem value="document">Documentos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => {
          const usageCount = getUsageCount(asset.id)
          return (
            <Card
              key={asset.id}
              className="group overflow-hidden hover:border-primary/50 transition-colors flex flex-col relative"
            >
              <div className="h-32 bg-muted flex items-center justify-center relative border-b">
                <TypeIcon
                  type={asset.type}
                  className="size-12 text-slate-300 group-hover:scale-110 transition-transform"
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="size-8"
                    onClick={() => setPreviewAsset(asset)}
                  >
                    <Eye className="size-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="size-8"
                    onClick={() => handleDelete(asset)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                {usageCount > 0 && (
                  <Badge className="absolute bottom-2 left-2 bg-blue-600 text-white text-[10px] uppercase font-bold shadow-md">
                    Em Uso ({usageCount})
                  </Badge>
                )}
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold line-clamp-1 mb-1 text-foreground" title={asset.name}>
                  {asset.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-medium">
                  <span className="uppercase">{asset.type}</span>
                  <span>•</span>
                  <span>{formatBytes(asset.sizeBytes)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {asset.tags.map((t) => (
                    <span
                      key={t}
                      className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
        {filteredAssets.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed rounded-xl bg-muted/20">
            <Search className="size-12 mx-auto text-muted-foreground opacity-30 mb-4" />
            <p className="font-medium text-lg">Nenhum arquivo encontrado.</p>
          </div>
        )}
      </div>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Fazer Upload para Biblioteca</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div
              className="border-2 border-dashed border-primary/40 rounded-xl p-8 text-center hover:bg-primary/5 transition-colors cursor-pointer"
              onClick={handleMockUpload}
            >
              <UploadCloud className="size-10 mx-auto text-primary mb-3" />
              <p className="font-semibold text-base">Clique ou arraste o arquivo aqui (Mock)</p>
              <p className="text-xs text-muted-foreground mt-1">
                MP4, PDF, PNG, JPG, DOCX (Max 500MB)
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Nome do Arquivo</label>
                <Input
                  value={newAsset.name || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="Ex: Aula_01_Introducao.mp4"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Tipo</label>
                  <Select
                    value={newAsset.type}
                    onValueChange={(v) => setNewAsset({ ...newAsset, type: v as MediaType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Vídeo (.mp4)</SelectItem>
                      <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                      <SelectItem value="image">Imagem (.png/.jpg)</SelectItem>
                      <SelectItem value="document">Documento (.docx)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Adicionar Tag</label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && tagInput) {
                          setNewAsset({ ...newAsset, tags: [...(newAsset.tags || []), tagInput] })
                          setTagInput('')
                        }
                      }}
                      placeholder="Enter..."
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => {
                        if (tagInput) {
                          setNewAsset({ ...newAsset, tags: [...(newAsset.tags || []), tagInput] })
                          setTagInput('')
                        }
                      }}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {newAsset.tags?.map((t) => (
                  <Badge key={t} variant="secondary" className="flex items-center gap-1">
                    {t}{' '}
                    <Trash2
                      className="size-3 cursor-pointer text-destructive"
                      onClick={() =>
                        setNewAsset({ ...newAsset, tags: newAsset.tags?.filter((x) => x !== t) })
                      }
                    />
                  </Badge>
                ))}
              </div>
            </div>
            <Button className="w-full h-12 font-bold" onClick={handleMockUpload}>
              Salvar na Biblioteca
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewAsset} onOpenChange={(o) => !o && setPreviewAsset(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
          {previewAsset && (
            <div className="relative">
              <div className="p-4 bg-black/80 text-white absolute top-0 w-full z-10 flex justify-between items-center">
                <h3 className="font-bold truncate pr-8">{previewAsset.name}</h3>
              </div>
              <div className="flex items-center justify-center min-h-[60vh] bg-slate-900 pt-14">
                {previewAsset.type === 'video' && (
                  <video src={previewAsset.url} controls className="w-full max-h-[80vh]" autoPlay />
                )}
                {previewAsset.type === 'pdf' && (
                  <iframe src={previewAsset.url} className="w-full h-[80vh] bg-white" />
                )}
                {previewAsset.type === 'image' && (
                  <img
                    src={previewAsset.url}
                    className="max-w-full max-h-[80vh] object-contain"
                    alt=""
                  />
                )}
                {previewAsset.type === 'document' && (
                  <div className="text-center text-white py-20">
                    <File className="size-20 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-medium">Visualização não disponível</p>
                    <Button className="mt-4" variant="secondary" asChild>
                      <a href={previewAsset.url} download>
                        Baixar Arquivo
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
