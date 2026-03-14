import { useEffect, useState } from 'react'
import { BellRing } from 'lucide-react'

export function LiveNotifier() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 3000)
    const t2 = setTimeout(() => setShow(false), 10000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4">
        <div className="bg-white/20 p-2 rounded-full animate-bounce">
          <BellRing className="size-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm">Bem-vindo à Plataforma</h4>
          <p className="text-xs text-blue-100">Explore nosso acervo e trilhas de capacitação.</p>
        </div>
      </div>
    </div>
  )
}
