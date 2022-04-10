import puppeteer from 'puppeteer'

const main = async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    headless: false
  })

  const weblioPage = await browser.newPage();
  // Weblioの検索ワードランキングへ遷移
  await weblioPage.goto('https://ejje.weblio.jp/ranking', { waitUntil: 'domcontentloaded' })
  const top50Words = await weblioPage.evaluate(() => {
    const rows = document.querySelectorAll('#main > div.mainBoxB > table > tbody > tr')
    return Array.from(rows, row => {return row.querySelector<HTMLElement>('td > a')?.innerText ?? ''})
  })
  // Wordleへの入力として上位50単語のうち5文字の英単語を6つ上位から取り出す
  const answers = top50Words.filter(word => word.length === 5).slice(0, 6)
  console.log(answers)

  // Wordleへ遷移
  const wordlePage = await browser.newPage();
  await wordlePage.goto('https://www.nytimes.com/games/wordle/index.html', { waitUntil: 'domcontentloaded' })
  // ゲーム説明のモーダルを閉じる
  await wordlePage.evaluate(() => {
    const closeModalIcon = document.querySelector("body > game-app")?.shadowRoot?.querySelector("#game > game-modal")?.shadowRoot?.querySelector<HTMLElement>("div > div > div")
    closeModalIcon?.click()
  })
  await wordlePage.waitForTimeout(3000)

  // 3秒おきに回答を入力
  for (const answer of answers) {
    await wordlePage.type('body > game-app', answer)
    await wordlePage.waitForTimeout(500)
    await wordlePage.keyboard.press('Enter')
    await wordlePage.waitForTimeout(3000)
  }
  

  //await browser.close();
}

main().catch(console.error)