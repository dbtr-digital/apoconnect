import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Kategorien erstellen
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Recht & Vorschriften', slug: 'recht', icon: 'Scale', color: '#6366f1', sortOrder: 1 }
    }),
    prisma.category.create({
      data: { name: 'Finanzen & Steuern', slug: 'finanzen', icon: 'Wallet', color: '#10b981', sortOrder: 2 }
    }),
    prisma.category.create({
      data: { name: 'IT & Digitalisierung', slug: 'it', icon: 'Monitor', color: '#8b5cf6', sortOrder: 3 }
    }),
    prisma.category.create({
      data: { name: 'Personal & HR', slug: 'personal', icon: 'Users', color: '#f59e0b', sortOrder: 4 }
    }),
    prisma.category.create({
      data: { name: 'Marketing', slug: 'marketing', icon: 'Megaphone', color: '#ec4899', sortOrder: 5 }
    }),
    prisma.category.create({
      data: { name: 'Warenwirtschaft', slug: 'warenwirtschaft', icon: 'Package', color: '#14b8a6', sortOrder: 6 }
    }),
    prisma.category.create({
      data: { name: 'Rezeptur & Labor', slug: 'rezeptur', icon: 'FlaskConical', color: '#f97316', sortOrder: 7 }
    }),
    prisma.category.create({
      data: { name: 'Allgemein', slug: 'allgemein', icon: 'MessageSquare', color: '#64748b', sortOrder: 8 }
    })
  ])

  console.log('Categories created:', categories.length)

  // Tags erstellen
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'e-rezept', slug: 'e-rezept', usageCount: 128 } }),
    prisma.tag.create({ data: { name: 'lieferengpass', slug: 'lieferengpass', usageCount: 96 } }),
    prisma.tag.create({ data: { name: 'retax', slug: 'retax', usageCount: 74 } }),
    prisma.tag.create({ data: { name: 'digitalisierung', slug: 'digitalisierung', usageCount: 61 } }),
    prisma.tag.create({ data: { name: 'personal', slug: 'personal', usageCount: 45 } }),
    prisma.tag.create({ data: { name: 'btm', slug: 'btm', usageCount: 38 } }),
    prisma.tag.create({ data: { name: 'rabattvertrag', slug: 'rabattvertrag', usageCount: 32 } }),
    prisma.tag.create({ data: { name: 'cardlink', slug: 'cardlink', usageCount: 28 } }),
    prisma.tag.create({ data: { name: 'warenwirtschaft', slug: 'warenwirtschaft', usageCount: 24 } }),
    prisma.tag.create({ data: { name: 'impfung', slug: 'impfung', usageCount: 21 } })
  ])

  console.log('Tags created:', tags.length)

  // Passwort hashen (für alle Demo-Accounts: "demo1234")
  const passwordHash = await bcrypt.hash('demo1234', 12)

  // Demo-Apotheken erstellen
  const pharmacy1 = await prisma.pharmacy.create({
    data: {
      name: 'Stadt-Apotheke Berlin',
      address: 'Alexanderplatz 1',
      city: 'Berlin',
      zipCode: '10178',
      email: 'info@stadt-apotheke-berlin.de',
      phone: '+49 30 12345678',
      website: 'https://www.stadt-apotheke-berlin.de',
      description: 'Ihre Apotheke im Herzen Berlins - seit über 50 Jahren.',
      verified: true,
      users: {
        create: {
          email: 'demo@apoconnect.de',
          passwordHash,
          firstName: 'Max',
          lastName: 'Mustermann',
          role: 'OWNER',
          position: 'Apotheker',
          bio: 'Apotheker mit Leidenschaft für Digitalisierung und Vernetzung.',
          emailVerified: true
        }
      }
    },
    include: { users: true }
  })

  const pharmacy2 = await prisma.pharmacy.create({
    data: {
      name: 'Sonnen-Apotheke München',
      address: 'Marienplatz 5',
      city: 'München',
      zipCode: '80331',
      email: 'info@sonnen-apotheke.de',
      phone: '+49 89 98765432',
      verified: true,
      users: {
        create: {
          email: 'anna@sonnen-apotheke.de',
          passwordHash,
          firstName: 'Anna',
          lastName: 'Schmidt',
          role: 'OWNER',
          position: 'Apothekerin',
          emailVerified: true
        }
      }
    },
    include: { users: true }
  })

  const pharmacy3 = await prisma.pharmacy.create({
    data: {
      name: 'Rathaus-Apotheke Hamburg',
      address: 'Rathausmarkt 3',
      city: 'Hamburg',
      zipCode: '20095',
      email: 'info@rathaus-apotheke-hh.de',
      verified: true,
      users: {
        create: {
          email: 'peter@rathaus-apotheke.de',
          passwordHash,
          firstName: 'Peter',
          lastName: 'Weber',
          role: 'OWNER',
          position: 'Apotheker',
          emailVerified: true
        }
      }
    },
    include: { users: true }
  })

  console.log('Pharmacies created:', 3)

  // Demo-Posts erstellen
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'E-Rezept: Tipps für den reibungslosen Ablauf',
        content: `Nach mehreren Monaten E-Rezept möchte ich meine Erfahrungen teilen:

**Was gut funktioniert:**
- CardLink-Verfahren läuft nach anfänglichen Problemen stabil
- Kunden gewöhnen sich schnell daran
- Weniger Papier im Workflow

**Herausforderungen:**
- Gelegentliche Verzögerungen bei der Übermittlung
- Schulungsbedarf beim Personal
- Technische Probleme bei manchen Kartenlesegeräten

Hat jemand ähnliche Erfahrungen oder weitere Tipps?`,
        excerpt: 'Nach mehreren Monaten E-Rezept möchte ich meine Erfahrungen teilen...',
        visibility: 'PUBLIC',
        isPinned: true,
        viewCount: 234,
        authorId: pharmacy1.users[0].id,
        pharmacyId: pharmacy1.id,
        categoryId: categories.find(c => c.slug === 'it')!.id,
        tags: {
          create: [
            { tag: { connect: { slug: 'e-rezept' } } },
            { tag: { connect: { slug: 'digitalisierung' } } },
            { tag: { connect: { slug: 'cardlink' } } }
          ]
        }
      }
    }),
    prisma.post.create({
      data: {
        title: 'Aktuelle Lieferengpässe - Alternativen für Ozempic',
        content: `Die Liefersituation bei Ozempic ist weiterhin angespannt. Hier meine Erfahrungen mit Alternativen:

- Wegovy als Alternative (wenn verfügbar)
- Trulicity bei Typ-2-Diabetes
- Enge Absprache mit Ärzten für individuelle Lösungen

Wie geht ihr mit den Rückfragen der Patienten um?`,
        excerpt: 'Die Liefersituation bei Ozempic ist weiterhin angespannt...',
        visibility: 'PUBLIC',
        viewCount: 189,
        authorId: pharmacy2.users[0].id,
        pharmacyId: pharmacy2.id,
        categoryId: categories.find(c => c.slug === 'warenwirtschaft')!.id,
        tags: {
          create: [
            { tag: { connect: { slug: 'lieferengpass' } } }
          ]
        }
      }
    }),
    prisma.post.create({
      data: {
        title: 'Retax vermeiden: Checkliste für die Rezeptbearbeitung',
        content: `Nach vielen Jahren Erfahrung habe ich eine Checkliste erstellt, die unsere Retaxen deutlich reduziert hat:

1. **Grunddaten prüfen**
   - Verordnungsdatum aktuell?
   - Arztstempel vollständig?
   - Unterschrift vorhanden?

2. **Medikation checken**
   - Rabattvertrag beachten
   - Packungsgröße korrekt?
   - Dosierung plausibel?

3. **Abrechnung**
   - Zuzahlung korrekt erfasst?
   - Sonderentgelte berücksichtigt?

Die vollständige Checkliste stelle ich gerne zur Verfügung!`,
        excerpt: 'Nach vielen Jahren Erfahrung habe ich eine Checkliste erstellt...',
        visibility: 'PUBLIC',
        viewCount: 312,
        authorId: pharmacy3.users[0].id,
        pharmacyId: pharmacy3.id,
        categoryId: categories.find(c => c.slug === 'recht')!.id,
        tags: {
          create: [
            { tag: { connect: { slug: 'retax' } } },
            { tag: { connect: { slug: 'rabattvertrag' } } }
          ]
        }
      }
    }),
    prisma.post.create({
      data: {
        title: 'PTA-Nachwuchs: Wie finden wir gute Mitarbeiter?',
        content: `Wir haben große Schwierigkeiten, qualifiziertes Personal zu finden. Was funktioniert bei euch?

Unsere Ansätze:
- Praktikumsplätze anbieten und gut betreuen
- Präsenz an Berufsschulen
- Attraktive Arbeitszeitmodelle
- Weiterbildungsmöglichkeiten

Wie sind eure Erfahrungen?`,
        excerpt: 'Wir haben große Schwierigkeiten, qualifiziertes Personal zu finden...',
        visibility: 'PUBLIC',
        viewCount: 156,
        authorId: pharmacy1.users[0].id,
        pharmacyId: pharmacy1.id,
        categoryId: categories.find(c => c.slug === 'personal')!.id,
        tags: {
          create: [
            { tag: { connect: { slug: 'personal' } } }
          ]
        }
      }
    })
  ])

  console.log('Posts created:', posts.length)

  // Partner erstellen
  const partners = await Promise.all([
    prisma.partner.create({
      data: {
        name: 'ApoSicher Versicherungen',
        type: 'INSURANCE',
        description: 'Spezialist für Apotheken-Versicherungen: Betriebshaftpflicht, Cyberversicherung und mehr.',
        website: 'https://www.aposicher.de',
        email: 'kontakt@aposicher.de',
        verified: true,
        offers: {
          create: [
            {
              title: 'Cyberversicherung für Apotheken',
              description: 'Umfassender Schutz vor Cyberangriffen, Datenverlust und IT-Ausfällen.',
              price: 'ab 89€/Monat',
              validUntil: new Date('2025-12-31'),
              viewCount: 45
            },
            {
              title: 'Betriebshaftpflicht Kompakt',
              description: 'Speziell für Apotheken entwickelte Betriebshaftpflichtversicherung.',
              price: 'ab 149€/Monat',
              viewCount: 32
            }
          ]
        }
      }
    }),
    prisma.partner.create({
      data: {
        name: 'PharmaTech IT',
        type: 'IT_SERVICE',
        description: 'Ihr Partner für Warenwirtschaft, IT-Infrastruktur und digitale Transformation.',
        website: 'https://www.pharmatech-it.de',
        email: 'info@pharmatech-it.de',
        verified: true,
        offers: {
          create: [
            {
              title: 'E-Rezept Integration',
              description: 'Komplettlösung für die nahtlose E-Rezept-Anbindung Ihrer Apotheke.',
              price: 'Einmalig 990€',
              viewCount: 78
            }
          ]
        }
      }
    }),
    prisma.partner.create({
      data: {
        name: 'ApoConsult',
        type: 'CONSULTING',
        description: 'Unternehmensberatung spezialisiert auf Apotheken: Finanzen, Prozesse, Strategie.',
        website: 'https://www.apoconsult.de',
        email: 'beratung@apoconsult.de',
        verified: true,
        offers: {
          create: [
            {
              title: 'Kostenloser Erstcheck',
              description: 'Analyse Ihrer Apothekenfinanzen und erste Optimierungsvorschläge.',
              price: 'Kostenlos',
              viewCount: 123
            }
          ]
        }
      }
    }),
    prisma.partner.create({
      data: {
        name: 'MediSoft Solutions',
        type: 'SOFTWARE',
        description: 'Moderne Softwarelösungen für Apotheken: Warenwirtschaft, Kundenbindung, Analytics.',
        website: 'https://www.medisoft.de',
        email: 'vertrieb@medisoft.de',
        verified: false,
        offers: {
          create: [
            {
              title: 'Kundenbindungs-App',
              description: 'White-Label App für Ihre Apotheke mit Bonusprogramm und Push-Benachrichtigungen.',
              price: 'ab 199€/Monat',
              viewCount: 56
            }
          ]
        }
      }
    })
  ])

  console.log('Partners created:', partners.length)

  // Breakout Room erstellen
  const room = await prisma.breakoutRoom.create({
    data: {
      name: 'Berliner Apotheken',
      description: 'Austausch für Apotheken in Berlin und Umgebung',
      isPrivate: true,
      ownerId: pharmacy1.id,
      members: {
        create: {
          pharmacyId: pharmacy1.id,
          userId: pharmacy1.users[0].id,
          role: 'ADMIN'
        }
      }
    }
  })

  console.log('Breakout Room created:', room.name)

  console.log('\n✅ Seed completed!')
  console.log('\n📧 Demo-Login:')
  console.log('   E-Mail: demo@apoconnect.de')
  console.log('   Passwort: demo1234')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
