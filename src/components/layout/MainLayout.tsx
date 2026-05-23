import Nav from './Nav'
import Footer from './Footer'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import WorkExperience from '@/components/sections/WorkExperience'
import Education from '@/components/sections/Education'
import TechStack from '@/components/sections/TechStack'
import Projects from '@/components/sections/Projects'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Nav />
      <main>
        <Hero />
        <About />
        <WorkExperience />
        <Education />
        <TechStack />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
