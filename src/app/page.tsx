import Link from "next/link"
import { Building2, Users, Shield, MessageSquare, Briefcase, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="px-4 py-6">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">ApoConnect</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Anmelden
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Registrieren
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Die Plattform für<br />
            <span className="text-emerald-600">vernetzte Apotheken</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tauschen Sie sich mit anderen Apotheken aus, teilen Sie Wissen und
            stärken Sie gemeinsam Ihre Position im Markt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
            >
              Kostenlos registrieren
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Bereits Mitglied? Anmelden
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Warum ApoConnect?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="Fachlicher Austausch"
              description="Diskutieren Sie aktuelle Themen wie E-Rezept, Lieferengpässe und Retaxfragen mit Kolleginnen und Kollegen."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Private Gruppen"
              description="Erstellen Sie Breakout-Rooms für den vertraulichen Austausch in kleinen Gruppen."
            />
            <FeatureCard
              icon={<Briefcase className="h-6 w-6" />}
              title="Partner-Angebote"
              description="Profitieren Sie von exklusiven Angeboten von Versicherungen, IT-Dienstleistern und mehr."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="DSGVO-konform"
              description="Ihre Daten sind sicher. Wir hosten in Deutschland und erfüllen alle Datenschutzanforderungen."
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Automatische Tags"
              description="Intelligente Verschlagwortung hilft Ihnen, relevante Beiträge schnell zu finden."
            />
            <FeatureCard
              icon={<Building2 className="h-6 w-6" />}
              title="Apothekenprofile"
              description="Präsentieren Sie Ihre Apotheke und vernetzen Sie sich mit Kollegen in Ihrer Region."
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-16 bg-emerald-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-4xl font-bold mb-2">1.200+</p>
              <p className="text-emerald-100">Apotheken</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">3.800+</p>
              <p className="text-emerald-100">Mitglieder</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">15.000+</p>
              <p className="text-emerald-100">Beiträge</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">50+</p>
              <p className="text-emerald-100">Partner</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bereit, Teil der Community zu werden?
          </h2>
          <p className="text-gray-600 mb-8">
            Registrieren Sie sich jetzt kostenlos und vernetzen Sie sich mit
            Apotheken aus ganz Deutschland.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            Jetzt kostenlos starten
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">ApoConnect</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 ApoConnect. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900">Impressum</a>
            <a href="#" className="hover:text-gray-900">Datenschutz</a>
            <a href="#" className="hover:text-gray-900">AGB</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}
