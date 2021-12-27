
const getKlaytnApiUrl = () => {
  const chainId = process.env.REACT_APP_KLAYTN_ID
  let apiUrl

  switch(chainId) {
    case "1001":
      apiUrl = 'https://api.taalswap.info/baobab/api'
      break
    case "8217":
    default:
      apiUrl = 'https://api.taalswap.info/cypress/api'
      break
  }

  return apiUrl
}

export default getKlaytnApiUrl
