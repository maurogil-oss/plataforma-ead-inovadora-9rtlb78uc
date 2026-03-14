import { useMemo, useState } from 'react'
import { useLmsStore } from '@/stores/lmsStore'

export function useReportsData() {
  const { enrollments, students, courses } = useLmsStore()
  const [courseFilter, setCourseFilter] = useState('all')

  const filteredEnrollments = useMemo(() => {
    if (courseFilter === 'all') return enrollments
    return enrollments.filter((e) => e.courseId === courseFilter)
  }, [enrollments, courseFilter])

  const studentReports = useMemo(() => {
    const studentData = new Map()
    filteredEnrollments.forEach((e) => {
      if (!studentData.has(e.studentId)) {
        studentData.set(e.studentId, {
          student: students.find((s) => s.id === e.studentId),
          enrollments: [],
        })
      }
      studentData.get(e.studentId).enrollments.push(e)
    })

    return Array.from(studentData.values()).map(({ student, enrollments }) => {
      let totalProgress = 0
      enrollments.forEach((e: any) => {
        const c = courses.find((x) => x.id === e.courseId)
        const totalLessons = c?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0
        totalProgress += totalLessons > 0 ? (e.completedLessons.length / totalLessons) * 100 : 0
      })
      const avgProgress = enrollments.length > 0 ? totalProgress / enrollments.length : 0

      return {
        id: student?.id,
        name: student?.name,
        email: student?.email,
        courseCount: enrollments.length,
        avgProgress: Math.round(avgProgress),
      }
    })
  }, [filteredEnrollments, students, courses])

  const courseReports = useMemo(() => {
    const relevantCourses =
      courseFilter === 'all' ? courses : courses.filter((c) => c.id === courseFilter)

    return relevantCourses.map((c) => {
      const courseEnrolls = enrollments.filter((e) => e.courseId === c.id)
      const totalLessons = c.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0
      let sumProgress = 0
      let completedCount = 0

      courseEnrolls.forEach((e) => {
        const progress = totalLessons > 0 ? (e.completedLessons.length / totalLessons) * 100 : 0
        sumProgress += progress
        if (e.isCompleted) completedCount++
      })

      return {
        id: c.id,
        title: c.title,
        studentsCount: courseEnrolls.length,
        avgProgress: courseEnrolls.length > 0 ? Math.round(sumProgress / courseEnrolls.length) : 0,
        completedCount,
      }
    })
  }, [enrollments, courses, courseFilter])

  const activityReports = useMemo(() => {
    return filteredEnrollments
      .flatMap((e) =>
        e.activityLog.map((act) => ({
          ...act,
          student: students.find((s) => s.id === e.studentId),
          course: courses.find((c) => c.id === e.courseId),
        })),
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [filteredEnrollments, students, courses])

  return { courseFilter, setCourseFilter, studentReports, courseReports, activityReports, courses }
}
