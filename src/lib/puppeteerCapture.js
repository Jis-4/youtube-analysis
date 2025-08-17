const puppeteer = require('puppeteer-core');
const fs = require('fs');

module.exports = async function capture(youtubeUrl, screenshotPath) {
  const executablePath = process.env.PUPPETEER_EXECUTABLE || '/usr/bin/chromium';
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    await page.goto(youtubeUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // wait for video element
    await page.waitForSelector('video', { timeout: 15000 }).catch(() => {});

    // attempt to start playback using JS
    try {
      await page.evaluate(() => {
        const v = document.querySelector('video');
        if (v) {
          v.play();
        }
      });
      // wait briefly to allow a frame
      await page.waitForTimeout(3000);
    } catch (e) {
      // ignore playback failure; still take screenshot
    }

    // screenshot main video area if available, otherwise full page
    const videoHandle = await page.$('video');
    if (videoHandle) {
      await videoHandle.screenshot({ path: screenshotPath });
    } else {
      await page.screenshot({ path: screenshotPath, fullPage: false });
    }
  } finally {
    await browser.close();
  }
};
