import { chromium } from 'playwright';

const ENV_VARS = {
  DATABASE_URL: 'postgresql://neondb_owner:npg_BPndo2qO9szx@ep-curly-mode-akifzenq.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require',
  DIRECT_URL: 'postgresql://neondb_owner:npg_BPndo2qO9szx@ep-curly-mode-akifzenq.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require',
  AUTH_SECRET: 'apo-connect-secret-key-2024-secure-production'
};

async function deployToVercel() {
  console.log('🚀 Starte automatisches Vercel Deployment...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });

  const page = await context.newPage();

  try {
    // Step 1: Go to Vercel new project
    console.log('📦 Öffne Vercel...');
    await page.goto('https://vercel.com/new');
    await page.waitForLoadState('networkidle');

    // Check if we need to login
    if (page.url().includes('login')) {
      console.log('⏳ Bitte in Vercel einloggen (GitHub)...');
      await page.waitForURL('**/new**', { timeout: 120000 });
    }

    console.log('✅ Vercel geladen');

    // Step 2: Search and select GitHub repo
    console.log('🔍 Suche nach apoconnect Repository...');

    // Wait for the import section
    await page.waitForTimeout(3000);

    // Look for the repo in the list or search for it
    const repoLink = page.locator('text=apoconnect').first();

    if (await repoLink.isVisible({ timeout: 5000 })) {
      console.log('📁 Repository gefunden, importiere...');

      // Find and click the Import button next to apoconnect
      const importBtn = page.locator('button:has-text("Import")').first();
      if (await importBtn.isVisible({ timeout: 3000 })) {
        await importBtn.click();
      } else {
        await repoLink.click();
      }
    } else {
      // Try clicking "Import Git Repository" or similar
      console.log('⏳ Suche Import-Option...');
      const importGit = page.locator('text=Import Git Repository');
      if (await importGit.isVisible({ timeout: 3000 })) {
        await importGit.click();
      }

      // Enter repo URL
      const urlInput = page.locator('input[placeholder*="URL"]').first();
      if (await urlInput.isVisible({ timeout: 3000 })) {
        await urlInput.fill('https://github.com/dbtr-digital/apoconnect');
        await page.keyboard.press('Enter');
      }
    }

    await page.waitForTimeout(3000);

    // Step 3: Configure project - expand Environment Variables
    console.log('⚙️ Konfiguriere Environment Variables...');

    // Look for Environment Variables section
    const envSection = page.locator('text=Environment Variables');
    if (await envSection.isVisible({ timeout: 5000 })) {
      await envSection.click();
      await page.waitForTimeout(1000);
    }

    // Add each environment variable
    for (const [key, value] of Object.entries(ENV_VARS)) {
      console.log(`   Adding ${key}...`);

      // Find name and value inputs
      const nameInput = page.locator('input[placeholder*="NAME"], input[placeholder*="Key"], input[name="name"]').last();
      const valueInput = page.locator('input[placeholder*="VALUE"], input[placeholder*="value"], input[name="value"]').last();

      if (await nameInput.isVisible({ timeout: 2000 })) {
        await nameInput.fill(key);
      }

      if (await valueInput.isVisible({ timeout: 2000 })) {
        await valueInput.fill(value);
      }

      // Click Add button
      const addBtn = page.locator('button:has-text("Add")').last();
      if (await addBtn.isVisible({ timeout: 2000 })) {
        await addBtn.click();
        await page.waitForTimeout(500);
      }
    }

    console.log('✅ Environment Variables konfiguriert');

    // Step 4: Click Deploy
    console.log('🚀 Starte Deployment...');
    const deployBtn = page.locator('button:has-text("Deploy")').first();
    if (await deployBtn.isVisible({ timeout: 5000 })) {
      await deployBtn.click();
    }

    // Wait for deployment
    console.log('⏳ Warte auf Deployment...');

    // Wait for success page or deployment completion
    await page.waitForURL('**/**/success**', { timeout: 600000 }).catch(() => {});

    // Try to get the deployment URL
    await page.waitForTimeout(5000);
    const urlElement = page.locator('a[href*=".vercel.app"]').first();
    if (await urlElement.isVisible({ timeout: 10000 })) {
      const deployUrl = await urlElement.getAttribute('href');
      console.log('\n✅ DEPLOYMENT ERFOLGREICH!');
      console.log(`🌐 URL: ${deployUrl}`);
    } else {
      console.log('\n✅ Deployment gestartet! Prüfe Browser für URL.');
    }

  } catch (error) {
    console.log('\n⚠️ Automatisierung unterbrochen:', error);
    console.log('   Browser bleibt offen für manuelle Fertigstellung.');
  }

  // Keep browser open
  console.log('\n🎉 Browser bleibt offen. Ctrl+C zum Beenden.');
  await new Promise(() => {});
}

deployToVercel().catch(console.error);
