const puppeteer = require('puppeteer')

// browser options
const reqHeaders = {
  Referer: 'https://www.alza.hu',
  Connection: 'keep-alive',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.5',
  DNT: '1'
}
const viewPort = { width: 2560, height: 1440 }
const ProductsURL = 'https://www.alza.hu/olcso-nvidia-geforce-rtx-30-videokartyak/18881565.htm#f&limit=-1--200000&cst=1&cud=0&pg=1&pn=1&prod=&par340=340-239785899,340-239797673&sc=321.8999938964844'

// take a screenshot of a URL
exports.snapImg = async (url) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setJavaScriptEnabled(true)
  await page.setViewport(viewPort)
  await page.setExtraHTTPHeaders(reqHeaders)
  await page.goto(url)
  // wait for filters to load
  await page.waitForTimeout(4000)
  // take screenshot
  await page.screenshot({ path: 'img.jpeg', type: 'jpeg' })
}

// scrape algorithm
const scrapeProducts = async () => {
  const rawProducts = document.querySelectorAll('div[class*="box browsingitem js-box"]')
  const products = []
  rawProducts.forEach(async (rawProduct) => {
    const newProduct = {
      name: rawProduct.children[0].children[1].children[1].innerText,
      price: rawProduct.children[1].children[0].children[0].innerText,
      status: rawProduct.children[1].children[1].innerText
    }
    products.push(newProduct)
  })
  return products
}

// run headless browser
const scrapeJob = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  // set req headers to avoid bot detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36')
  await page.setJavaScriptEnabled(true)
  await page.setViewport(viewPort)
  await page.setExtraHTTPHeaders(reqHeaders)
  await page.goto(ProductsURL)
  // wait for filters to load
  await page.waitForTimeout(4000)
  // exec script in browser context
  const productStatuses = await page.evaluate(scrapeProducts)
  console.log(productStatuses)
  await browser.close()
}

exports.refresh = async () => {
  try {
    await scrapeJob()
    // setInterval(async () => {
    //   try {
    //     const now = new Date(Date.now())
    //     console.log(`1s msg -- ${now}`)
    //     await scrapeJob()
    //   } catch (error) {
    //     console.log('error in interval')
    //     console.log(error)
    //   }
    // }, 16000)
  } catch (error) {
    console.log('Error in refresh function')
    console.log(error)
    return false
  }
}
