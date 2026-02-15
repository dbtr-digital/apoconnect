import { chromium } from 'playwright';

async function deploy() {
  console.log('🚀 Starting ApoConnect Deployment...\n');

  // Launch browser with visible window
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  // Step 1: Neon Database
  console.log('📦 Step 1: Creating Neon PostgreSQL Database...');
  console.log('   Please login with GitHub when prompted.\n');

  await page.goto('https://console.neon.tech/signup');

  // Wait for user to complete GitHub OAuth and create project
  console.log('⏳ Waiting for you to:');
  console.log('   1. Click "Continue with GitHub"');
  console.log('   2. Authorize Neon');
  console.log('   3. Create a new project named "apoconnect"');
  console.log('   4. Copy the connection string\n');

  // Wait for dashboard page (indicates successful login and project creation)
  try {
    await page.waitForURL('**/app/projects/**', { timeout: 300000 });
    console.log('✅ Neon project detected!\n');

    // Try to find and copy connection string
    await page.waitForTimeout(3000);

    // Look for connection string on page
    const connectionString = await page.evaluate(() => {
      const elements = document.querySelectorAll('input, code, pre');
      for (const el of elements) {
        const text = (el as HTMLInputElement).value || el.textContent || '';
        if (text.includes('postgresql://') && text.includes('neon.tech')) {
          return text.trim();
        }
      }
      return null;
    });

    if (connectionString) {
      console.log('🔗 Connection String found!');
      console.log(`   ${connectionString.substring(0, 50)}...\n`);

      // Step 2: Vercel Deployment
      console.log('🚀 Step 2: Deploying to Vercel...\n');

      const vercelUrl = new URL('https://vercel.com/new/clone');
      vercelUrl.searchParams.set('repository-url', 'https://github.com/dbtr-digital/apoconnect');
      vercelUrl.searchParams.set('env', 'DATABASE_URL,DIRECT_URL,AUTH_SECRET');

      await page.goto(vercelUrl.toString());

      console.log('⏳ Waiting for you to:');
      console.log('   1. Login with GitHub (if needed)');
      console.log('   2. Fill in environment variables:');
      console.log(`      DATABASE_URL: ${connectionString}`);
      console.log(`      DIRECT_URL: ${connectionString}`);
      console.log('      AUTH_SECRET: apo-connect-secret-2024');
      console.log('   3. Click Deploy\n');

      // Wait for deployment completion
      await page.waitForURL('**/**/success**', { timeout: 600000 });

      const finalUrl = page.url();
      console.log('✅ Deployment complete!');
      console.log(`   URL: ${finalUrl}\n`);

    } else {
      console.log('⚠️  Could not auto-detect connection string.');
      console.log('   Please copy it manually and continue to Vercel.\n');
    }

  } catch (error) {
    console.log('⏳ Timeout or navigation issue. Please complete manually.');
  }

  console.log('🎉 Browser will stay open for you to complete any remaining steps.');
  console.log('   Press Ctrl+C to close when done.\n');

  // Keep browser open
  await new Promise(() => {});
}

deploy().catch(console.error);
