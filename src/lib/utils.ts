import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function timeAgo(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'gerade eben'
  if (minutes < 60) return `vor ${minutes} Min.`
  if (hours < 24) return `vor ${hours} Std.`
  if (days < 7) return `vor ${days} Tagen`
  return formatDate(date)
}

export function generateExcerpt(content: string, maxLength: number = 150): string {
  const plainText = content.replace(/[#*_~`>\[\]]/g, '').trim()
  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).trim() + '...'
}

export function extractTags(content: string): string[] {
  const keywords = [
    'apotheke', 'rezept', 'medikament', 'arzneimittel', 'lieferengpass',
    'rabattvertrag', 'retax', 'btm', 'substitution', 'beratung',
    'marketing', 'personal', 'digitalisierung', 'software', 'kasse',
    'großhandel', 'versicherung', 'recht', 'steuer', 'finanzen',
    'e-rezept', 'cardlink', 'warenwirtschaft', 'notdienst', 'impfung'
  ]

  const contentLower = content.toLowerCase()
  const foundTags: string[] = []

  for (const keyword of keywords) {
    if (contentLower.includes(keyword)) {
      foundTags.push(keyword)
    }
  }

  return foundTags.slice(0, 5)
}
