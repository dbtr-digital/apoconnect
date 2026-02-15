# ApoConnect - Apotheken-Vernetzungsplattform

Eine Social-Networking-Plattform speziell für deutsche Apotheken zum Wissensaustausch und zur Vernetzung.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdbtr-digital%2Fapoconnect&env=DATABASE_URL,DIRECT_URL,AUTH_SECRET&envDescription=Database%20and%20auth%20configuration&envLink=https%3A%2F%2Fgithub.com%2Fdbtr-digital%2Fapoconnect%23environment-variables)

## Features

- **Forum & Feed** - LinkedIn/Instagram-Style Posts mit Auto-Tagging
- **Apotheken-Profile** - Inhaber, Mitarbeiter, Verifizierung
- **Breakout Rooms** - Private Gruppen-Diskussionen
- **Partner-Bereich** - Versicherungen, IT-Dienstleister (getrennt vom Hauptinhalt)
- **Suche & Tags** - Trending Tags, Volltextsuche
- **DSGVO-konform** - Deutsche Datenschutzstandards

## Quick Deploy

### 1. Datenbank erstellen (Neon.tech)

1. Gehe zu [neon.tech](https://neon.tech) und erstelle ein kostenloses Konto
2. Erstelle ein neues Projekt
3. Kopiere die Connection String

### 2. Deploy auf Vercel

Klicke den Button oben oder:

1. Gehe zu [vercel.com/new](https://vercel.com/new)
2. Importiere dieses Repository
3. Setze die Environment Variables (siehe unten)
4. Deploy!

### 3. Datenbank initialisieren

Nach dem Deploy:
```bash
npx prisma db push
npx prisma db seed
```

## Environment Variables

| Variable | Beschreibung |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL Connection String (Neon) |
| `DIRECT_URL` | Direkte DB-Verbindung (same as DATABASE_URL) |
| `AUTH_SECRET` | Geheimer Schluessel fuer NextAuth.js |

## Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Environment Variables setzen
cp .env.example .env.local
# Editiere .env.local mit deinen Werten

# Datenbank initialisieren
npx prisma db push
npm run db:seed

# Development Server starten
npm run dev
```

Oeffne [http://localhost:3000](http://localhost:3000)

## Demo-Accounts

Nach dem Seeding verfuegbar:

| Email | Passwort | Rolle |
|-------|----------|-------|
| demo@apoconnect.de | demo1234 | Owner |
| maria.schmidt@apoconnect.de | demo1234 | Owner |
| thomas.mueller@apoconnect.de | demo1234 | Manager |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **UI**: Radix UI Components

## Lizenz

Proprietaer - Alle Rechte vorbehalten
