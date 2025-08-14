const { connect } = require("puppeteer-real-browser");

async function createBrowser() {
    try {
        if (global.finished === true) return;

        global.browser = null;

        const { browser } = await connect({
            headless: false,
            turnstile: true,
            connectOption: { defaultViewport: null },
            disableXvfb: false,
        });

        global.browser = browser;

        // Once browser is ready, open a page and do actions
        await runActions(browser);

        browser.on('disconnected', async () => {
            if (global.finished === true) return;
            console.log('Browser disconnected');
            await new Promise(resolve => setTimeout(resolve, 3000));
            await createBrowser();
        });

    } catch (e) {
        console.log(e.message);
        if (global.finished === true) return;
        await new Promise(resolve => setTimeout(resolve, 3000));
        await createBrowser();
    }
}

async function runActions(browser) {
    const page = await browser.newPage();
    await page.goto("https://example.com", { waitUntil: "domcontentloaded" });

    // Type into address field
    await page.type("#address", "0x7cCe9b970b0273B8A05acb41ff01D23CFB21F358");

    // Wait for Cloudflare's cf-response
    await page.waitForSelector('[name="cf-response"]', { timeout: 60000 });

    // Click submit
    await page.click('button[type="submit"]');

    // Wait for result to appear
    await page.waitForSelector('#result', { timeout: 10000 });

    // Get full page source
    const pageSource = await page.content();
    console.log(pageSource);
}

createBrowser();