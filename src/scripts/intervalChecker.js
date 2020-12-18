exports.refresh = async () => {
  try {
    setInterval(() => {
      const now = new Date(Date.now())
      console.log(`1s msg -- ${now}`)
    }, 1000)
  } catch (error) {
    console.log('Error in refresh function')
    console.log(error)
    return false
  }
}
