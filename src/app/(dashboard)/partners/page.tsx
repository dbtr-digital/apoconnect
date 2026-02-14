"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Building2,
  Search,
  ExternalLink,
  Bookmark,
  Clock,
  Filter,
  Loader2,
  Shield,
  Monitor,
  Truck,
  HelpCircle,
  Cpu,
  Globe
} from "lucide-react"

interface Partner {
  id: string
  name: string
  type: string
  description?: string | null
  logoUrl?: string | null
  website?: string | null
  verified: boolean
  offers: PartnerOffer[]
}

interface PartnerOffer {
  id: string
  title: string
  description: string
  price?: string | null
  validUntil?: string | null
  viewCount: number
}

const partnerTypeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  INSURANCE: { label: "Versicherung", icon: <Shield className="h-4 w-4" />, color: "bg-blue-100 text-blue-700" },
  IT_SERVICE: { label: "IT-Dienstleister", icon: <Monitor className="h-4 w-4" />, color: "bg-purple-100 text-purple-700" },
  WHOLESALER: { label: "Großhändler", icon: <Truck className="h-4 w-4" />, color: "bg-orange-100 text-orange-700" },
  CONSULTING: { label: "Beratung", icon: <HelpCircle className="h-4 w-4" />, color: "bg-green-100 text-green-700" },
  SOFTWARE: { label: "Software", icon: <Cpu className="h-4 w-4" />, color: "bg-indigo-100 text-indigo-700" },
  OTHER: { label: "Sonstige", icon: <Globe className="h-4 w-4" />, color: "bg-gray-100 text-gray-700" }
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<PartnerOffer | null>(null)

  useEffect(() => {
    fetch("/api/partners")
      .then(res => res.json())
      .then(data => {
        setPartners(data)
        setLoading(false)
      })
  }, [])

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !selectedType || partner.type === selectedType
    return matchesSearch && matchesType
  })

  const types = Object.keys(partnerTypeConfig)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Partner & Angebote</h1>
        <p className="text-gray-500 text-sm mt-1">
          Exklusive Angebote von Versicherungen, IT-Dienstleistern und mehr
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Partner oder Angebote suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedType === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(null)}
            className="shrink-0"
          >
            <Filter className="h-4 w-4 mr-1" />
            Alle
          </Button>
          {types.map((type) => {
            const config = partnerTypeConfig[type]
            return (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="shrink-0"
              >
                {config.icon}
                <span className="ml-1">{config.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Partners List */}
      {filteredPartners.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Keine Partner gefunden
            </h3>
            <p className="text-gray-500 text-sm">
              Versuchen Sie eine andere Suche oder Filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredPartners.map((partner) => {
            const typeConfig = partnerTypeConfig[partner.type] || partnerTypeConfig.OTHER
            return (
              <Card key={partner.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                        {partner.logoUrl ? (
                          <img
                            src={partner.logoUrl}
                            alt={partner.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{partner.name}</CardTitle>
                          {partner.verified && (
                            <Badge variant="success" className="text-xs">
                              Verifiziert
                            </Badge>
                          )}
                        </div>
                        <Badge className={`${typeConfig.color} mt-1`}>
                          {typeConfig.icon}
                          <span className="ml-1">{typeConfig.label}</span>
                        </Badge>
                      </div>
                    </div>
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </CardHeader>

                {partner.description && (
                  <CardContent className="pt-0 pb-3">
                    <p className="text-sm text-gray-600">{partner.description}</p>
                  </CardContent>
                )}

                {/* Offers */}
                {partner.offers.length > 0 && (
                  <CardContent className="pt-0">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Aktuelle Angebote
                    </h4>
                    <div className="space-y-3">
                      {partner.offers.map((offer) => (
                        <div
                          key={offer.id}
                          className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => setSelectedOffer(offer)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {offer.title}
                              </h5>
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                {offer.description}
                              </p>
                            </div>
                            {offer.price && (
                              <Badge variant="outline" className="shrink-0 ml-3">
                                {offer.price}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            {offer.validUntil && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Gültig bis {new Date(offer.validUntil).toLocaleDateString('de-DE')}
                              </span>
                            )}
                            <span>{offer.viewCount} Aufrufe</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Offer Detail Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{selectedOffer.title}</CardTitle>
              {selectedOffer.price && (
                <Badge variant="default" className="w-fit">
                  {selectedOffer.price}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{selectedOffer.description}</p>

              {selectedOffer.validUntil && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  Gültig bis {new Date(selectedOffer.validUntil).toLocaleDateString('de-DE')}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOffer(null)}
                  className="flex-1"
                >
                  Schließen
                </Button>
                <Button className="flex-1">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Speichern
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
