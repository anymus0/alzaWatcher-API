const Browser = require('./../scripts/browser')
const browser = new Browser()

exports.getImage = async (req, res) => {
  try {
    // delete previous images
    await browser.removeImages()
    const img = await browser.snapImg(browser.productsURL)
    res.status(200).json({
      success: true,
      image: img
    })
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
      date: new Date(Date.now()),
      productsURL: browser.productsURL
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error
    })
  }
}
