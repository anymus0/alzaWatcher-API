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
