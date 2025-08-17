const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

module.exports = async function capture(youtubeUrl, screenshotPath) {
  // Auto-detect Chromium path based on OS
  let executablePath = process.env.PUPPETEER_EXECUTABLE;
  
  if (!executablePath) {
    if (process.platform === 'win32') {
      // Windows paths
      const possiblePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Chromium\\Application\\chrome.exe'
      ];
      
      for (const path of possiblePaths) {
        if (fs.existsSync(path)) {
          executablePath = path;
          break;
        }
      }
    } else if (process.platform === 'darwin') {
      // macOS paths
      executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    } else {
      // Linux paths
      executablePath = '/usr/bin/chromium';
    }
  }
  
  console.log('🔍 Using browser executable:', executablePath);
  
  if (!executablePath || !fs.existsSync(executablePath)) {
    throw new Error(`Browser not found. Please install Chrome/Chromium or set PUPPETEER_EXECUTABLE environment variable. 
    
    Windows: Install Google Chrome from https://www.google.com/chrome/
    macOS: Install Google Chrome from https://www.google.com/chrome/
    Linux: sudo apt-get install chromium-browser
    
    Or set PUPPETEER_EXECUTABLE to your browser path.`);
  }
  
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--autoplay-policy=no-user-gesture-required',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    console.log('🌐 Navigating to:', youtubeUrl);
    await page.goto(youtubeUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // wait for video element with better error handling
    let videoFound = false;
    try {
      await page.waitForSelector('video', { timeout: 15000 });
      videoFound = true;
      console.log('✅ Video element found');
    } catch (e) {
      console.log('⚠️ Video element not found, will take full page screenshot');
    }

    // attempt to start playback using JS
    if (videoFound) {
      try {
        await page.evaluate(() => {
          const v = document.querySelector('video');
          if (v) {
            v.play().catch(e => console.log('Playback failed:', e.message));
          }
        });
        // wait briefly to allow a frame
        await page.waitForTimeout(3000);
        console.log('▶️ Playback attempted');
      } catch (e) {
        console.log('⚠️ Playback failed, continuing with screenshot');
      }
    }

    // screenshot main video area if available, otherwise full page
    if (videoFound) {
      try {
        const videoHandle = await page.$('video');
        if (videoHandle) {
          await videoHandle.screenshot({ path: screenshotPath });
          console.log('📸 Video screenshot captured');
        } else {
          await page.screenshot({ path: screenshotPath, fullPage: false });
          console.log('📸 Full page screenshot captured');
        }
      } catch (screenshotError) {
        console.log('⚠️ Screenshot failed, trying full page:', screenshotError.message);
        await page.screenshot({ path: screenshotPath, fullPage: false });
      }
    } else {
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log('📸 Full page screenshot captured');
    }
    
    console.log('✅ Screenshot saved to:', screenshotPath);
  } catch (error) {
    console.error('❌ Screenshot capture failed:', error.message);
    throw new Error(`Screenshot capture failed: ${error.message}`);
  } finally {
    await browser.close();
  }
};
