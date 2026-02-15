import { chromium } from 'playwright';

async function deployToVercel() {
  console.log('🚀 Opening Vercel Import...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });

  const page = await context.newPage();

  // Go to Vercel import with GitHub repo
  const importUrl = 'https://vercel.com/new/import?s=https://github.com/dbtr-digital/apoconnect';
  await page.goto(importUrl);

  console.log('📋 Vercel Import geöffnet!');
  console.log('\n⏳ Bitte im Browser:');
  console.log('   1. Wähle das Repository "apoconnect"');
  console.log('   2. Bei "Environment Variables" füge hinzu:');
  console.log('');
  console.log('   DATABASE_URL:');
  console.log('   postgresql://neondb_owner:npg_BPndo2qO9szx@ep-curly-mode-akifzenq.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require');
  console.log('');
  console.log('   DIRECT_URL:');
  console.log('   postgresql://neondb_owner:npg_BPndo2qO9szx@ep-curly-mode-akifzenq.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require');
  console.log('');
  console.log('   AUTH_SECRET:');
  console.log('   apo-connect-secret-key-2024-secure-production');
  console.log('');
  console.log('   3. Klicke "Deploy"');

  // Wait for deployment to complete
  try {
    await page.waitForURL('**/success**', { timeout: 600000 });
    console.log('\n✅ Deployment erfolgreich!');
    console.log('   URL:', page.url());
  } catch {
    console.log('\n⏳ Warte auf Deploy-Abschluss...');
  }

  // Keep browser open
  await new Promise(() => {});
}

deployToVercel().catch(console.error);
