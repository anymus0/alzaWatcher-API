const Browser = require('./../scripts/browser')
const browser = new Browser()

exports.getImage = async (req, res) => {
  try {
    const img = await browser.snapImg(browser.productsURL)
    res.sendFile(img)
  } catch (error) {
    res.status().json({
      success: false,
      error: error
    })
  }
}

exports.getProdStatus = async (req, res) => {
  try {
    const prods = await browser.scrapeJob()
    res.status(200).json({
      success: true,
      products: prods,
      date: new Date(Date.now())
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error
    })
  }
}
