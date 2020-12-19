'use strict'
const puppeteer = require('puppeteer')
const path = require('path')

class Browser {
  constructor (
    viewPort = { width: 2560, height: 1440 },
    productsURL = 'https://www.alza.hu/olcso-nvidia-geforce-rtx-30-videokartyak/18881565.htm#f&limit=-1--200000&cst=1&cud=0&pg=1&pn=1&prod=&par340=340-239785899,340-239797673&sc=643.7999877929688'
  ) {
    // initial values
    this.reqHeaders = {
      Referer: 'https://www.alza.hu',
      Connection: 'keep-alive',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.5',
      DNT: '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
    }
    this.viewPort = viewPort
    this.productsURL = productsURL
    this.screenShotOpts = {
      path: path.join(process.cwd(), '..', 'img', 'img.jpeg'),
      type: 'jpeg'
    }
  }

  // methods

  // scrape algorithm
  async scrapeProducts () {
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
  async scrapeJob () {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // set req headers to avoid bot detection
    page.setJavaScriptEnabled(true)
    page.setViewport(this.viewPort)
    page.setExtraHTTPHeaders(this.reqHeaders)
    await page.goto(this.productsURL)
    // wait for filters to load
    await page.waitForTimeout(4000)
    // exec script in browser context
    const productStatuses = await page.evaluate(this.scrapeProducts)
    await browser.close()
    return productStatuses
  }

  // take a screenshot of a URL
  async snapImg (url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    page.setJavaScriptEnabled(true)
    page.setViewport(this.viewPort)
    page.setExtraHTTPHeaders(this.reqHeaders)
    await page.goto(url)
    // wait for filters to load
    await page.waitForTimeout(2000)
    // take screenshot
    await page.screenshot(this.screenShotOpts)
    await browser.close()
    return this.screenShotOpts.path
  }

  // end of class
}

module.exports = Browser
