import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { ProjectShowcase } from './components/ProjectShowcase'
import { BuiltIns } from './components/BuiltIns'
import { ExteriorServices } from './components/ExteriorServices'
import { FlipHouse } from './components/FlipHouse'
import { Commitment } from './components/Commitment'
import { FacebookSection } from './components/FacebookSection'
import { CallStrip } from './components/CallStrip'
import { EstimateSection } from './components/EstimateSection'
import { Footer } from './components/Footer'
import { AdminNotice } from './components/AdminNotice'
import { FloatingReviews } from './components/FloatingReviews'
import { publicContent } from './content/publicContent'
import { publishedContent } from './lib/publishedContent'

const content = publishedContent(publicContent)

export default function App() {
  const [admin, setAdmin] = useState(window.location.hash === '#admin')

  useEffect(() => {
    const followHash = () => {
      const isAdmin = window.location.hash === '#admin'
      setAdmin(isAdmin)
      if (!isAdmin && window.location.hash) {
        requestAnimationFrame(() =>
          document.getElementById(window.location.hash.slice(1))?.scrollIntoView(),
        )
      }
    }
    followHash()
    window.addEventListener('hashchange', followHash)
    return () => window.removeEventListener('hashchange', followHash)
  }, [])

  useEffect(() => {
    document.title = admin
      ? 'Admin | Henagin Home Improvement'
      : 'Henagin Home Improvement | Custom Builds, Remodels and Built-ins'
  }, [admin])

  return (
    <div className="min-h-screen bg-ploy-background-primary text-ploy-text-primary" id="top">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      {admin ? (
        <AdminNotice />
      ) : (
        <main id="main-content">
          <Hero />
          <Services />
          <ProjectShowcase />
          <BuiltIns />
          <ExteriorServices />
          <FlipHouse />
          <Commitment />
          <FacebookSection />
          <CallStrip />
          <EstimateSection />
        </main>
      )}
      <Footer />
      {!admin && <FloatingReviews reviews={content.reviews} />}
    </div>
  )
}
