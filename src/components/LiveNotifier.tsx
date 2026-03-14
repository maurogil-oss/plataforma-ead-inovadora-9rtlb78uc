import { useEffect, useRef } from 'react'
import { useLmsStore } from '@/stores/lmsStore'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'

export function LiveNotifier() {
  const user = useAuthStore((s) => s.user)
  const { liveClasses, enrollments } = useLmsStore()
  const notified = useRef(new Set<string>())

  useEffect(() => {
    if (!user) return

    const checkClasses = () => {
      let relevantClasses = liveClasses

      if (user.role === 'student') {
        const myCourseIds = enrollments
          .filter((e) => e.studentId === user.id)
          .map((e) => e.courseId)
        relevantClasses = liveClasses.filter((lc) => myCourseIds.includes(lc.courseId))
      }

      const now = new Date()

      relevantClasses.forEach((lc) => {
        const start = new Date(`${lc.date}T${lc.startTime}`)
        const diffMins = (start.getTime() - now.getTime()) / 60000

        if (diffMins > 0 && diffMins <= 15 && !notified.current.has(lc.id)) {
          notified.current.add(lc.id)
          toast.info('Aula ao vivo começando em breve!', {
            description: `${lc.title} começa em ${Math.ceil(diffMins)} minutos.`,
            icon: <Video className="size-5 text-blue-500" />,
            action: (
              <Button
                size="sm"
                className="bg-[#176a7e] hover:bg-[#115060]"
                onClick={() => window.open(lc.url, '_blank')}
              >
                Entrar Agora
              </Button>
            ),
            duration: 10000,
          })
        }
      })
    }

    checkClasses()
    const interval = setInterval(checkClasses, 60000)
    return () => clearInterval(interval)
  }, [user, liveClasses, enrollments])

  return null
}
