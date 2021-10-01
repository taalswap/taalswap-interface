const getAPIUrl = (targetChainId?: string) => {
  let chainId
  if (targetChainId) {
    chainId = targetChainId
  } else {
    chainId = window.localStorage.getItem('chainId');
  }
  let apiUrl;

  switch (chainId) {
    case '1001':
      apiUrl = 'https://api.taalswap.info/baobab/api';
      break;
    case '8217':
      apiUrl = 'https://api.taalswap.info/cypress/api';
      break;
    default:
      apiUrl = 'https://taalswap-info-api-black.vercel.app/api';
  }

  return apiUrl;
};

export default getAPIUrl;
