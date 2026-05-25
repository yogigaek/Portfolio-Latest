import { motion } from 'framer-motion'
import { GraduationCap, Calendar } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import Badge from '@/components/ui/Badge'
import useInView from '@/hooks/useInView'

interface EducationItem {
  institution: string
  degree: string
  major: string
  period: string
  gpa?: string
  highlights?: string[]
  logoInitials: string
  accentColor: string
}

const educationList: EducationItem[] = [
  {
    institution: 'Eduwork',
    degree: 'Full-Stack Web Development',
    major: 'Full-Stack Web Development Bootcamp',
    period: 'Jan 2022 – Jul 2022',
    highlights: [
      'Built full-stack MERN applications and RESTful APIs through hands-on, real-world projects',
      'Solved 200+ algorithm challenges on LeetCode, HackerRank, and Codeforces',
    ],
    logoInitials: 'EW',
    accentColor: '#10b981',
  },
  {
    institution: 'Universitas Lancang Kuning Pekanbaru',
    degree: 'Bachelor of Computer Science',
    major: 'Informatics Engineering',
    period: '2017 – 2021',
    highlights: [
      'Relevant coursework: Data Structures, Algorithms, Database Systems, Software Engineering, Computer Networks',
      'Focused on backend systems, software architecture, and applied programming',
    ],
    logoInitials: 'UL',
    accentColor: '#6366f1',
  },
]

export default function Education() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.1 })

  return (
    <section id="education" ref={ref} className="section-padding border-t border-border">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Academic Background"
          title="Education"
          subtitle="Formal education and professional training that shaped my engineering foundation."
        />

        <div className="space-y-6 max-w-4xl mx-auto">
          {educationList.map((edu, index) => (
            <motion.div
              key={edu.institution}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-surface border border-border rounded-2xl p-6 md:p-8 hover:border-border-hover transition-colors duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{
                      backgroundColor: edu.accentColor + '20',
                      border: `1px solid ${edu.accentColor}40`,
                      color: edu.accentColor,
                    }}
                  >
                    {edu.logoInitials}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-display text-lg font-bold text-text-primary">
                        {edu.degree}
                      </h3>
                    </div>
                    <p className="text-text-secondary font-medium text-sm">{edu.institution}</p>
                    <p className="text-text-muted text-sm">{edu.major}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-sm text-text-muted md:text-right flex-shrink-0">
                  <span className="flex items-center gap-1.5 md:justify-end">
                    <Calendar size={13} />
                    {edu.period}
                  </span>
                  {edu.gpa && (
                    <Badge variant="accent" className="self-start md:self-end">
                      <GraduationCap size={11} />
                      GPA {edu.gpa}
                    </Badge>
                  )}
                </div>
              </div>

              {edu.highlights && (
                <ul className="space-y-2 mt-4">
                  {edu.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
