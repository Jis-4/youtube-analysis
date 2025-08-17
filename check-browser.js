// Script to check browser availability and help configure Puppeteer
const fs = require('fs');
const path = require('path');

console.log('🔍 Browser Detection Script for YouTube Analysis Service\n');

function checkBrowserPaths() {
  const paths = [];
  
  if (process.platform === 'win32') {
    // Windows paths
    paths.push(
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Chromium\\Application\\chrome.exe'
    );
  } else if (process.platform === 'darwin') {
    // macOS paths
    paths.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium'
    );
  } else {
    // Linux paths
    paths.push(
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable'
    );
  }
  
  console.log('📂 Checking browser paths...\n');
  
  let foundBrowsers = [];
  
  for (const browserPath of paths) {
    if (fs.existsSync(browserPath)) {
      console.log(`✅ Found: ${browserPath}`);
      foundBrowsers.push(browserPath);
    } else {
      console.log(`❌ Not found: ${browserPath}`);
    }
  }
  
  return foundBrowsers;
}

function showInstallationInstructions() {
  console.log('\n📋 Installation Instructions:\n');
  
  if (process.platform === 'win32') {
    console.log('🪟 Windows:');
    console.log('   1. Download Google Chrome from: https://www.google.com/chrome/');
    console.log('   2. Install it normally');
    console.log('   3. The service will auto-detect it');
  } else if (process.platform === 'darwin') {
    console.log('🍎 macOS:');
    console.log('   1. Download Google Chrome from: https://www.google.com/chrome/');
    console.log('   2. Install it normally');
    console.log('   3. The service will auto-detect it');
  } else {
    console.log('🐧 Linux:');
    console.log('   Ubuntu/Debian: sudo apt-get install chromium-browser');
    console.log('   CentOS/RHEL: sudo yum install chromium');
    console.log('   Arch: sudo pacman -S chromium');
  }
}

function showEnvironmentVariableSetup() {
  console.log('\n🔧 Manual Setup (if auto-detection fails):\n');
  
  if (process.platform === 'win32') {
    console.log('Set environment variable:');
    console.log('   set PUPPETEER_EXECUTABLE="C:\\Path\\To\\Your\\Chrome.exe"');
  } else {
    console.log('Set environment variable:');
    console.log('   export PUPPETEER_EXECUTABLE="/path/to/your/chrome"');
  }
  
  console.log('\nOr add to your .env file:');
  console.log('   PUPPETEER_EXECUTABLE=/path/to/your/chrome');
}

// Run the check
const foundBrowsers = checkBrowserPaths();

if (foundBrowsers.length > 0) {
  console.log(`\n🎉 Success! Found ${foundBrowsers.length} browser(s)`);
  console.log('The YouTube Analysis service should work automatically.');
  console.log('\n💡 Recommended browser:', foundBrowsers[0]);
} else {
  console.log('\n❌ No browsers found!');
  showInstallationInstructions();
  showEnvironmentVariableSetup();
}

console.log('\n🚀 After installing a browser, restart the service and try again!');
