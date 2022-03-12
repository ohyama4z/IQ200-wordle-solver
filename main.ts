import puppeteer from 'puppeteer'

const main = async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    headless: false
  })
  const page = await browser.newPage();
  await page.goto('https://www.nytimes.com/games/wordle/index.html');
  await page.screenshot({ path: 'example.png' });

  //await browser.close();
}

main().catch(console.error)