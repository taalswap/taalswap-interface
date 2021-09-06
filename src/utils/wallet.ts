// Set of helper functions to facilitate wallet setup
import { ChainId } from 'taalswap-sdk'
import { BASE_BSC_SCAN_URL, SCAN_URL, NETWORK_NAME } from '../config'

const addNetwork = async (chainId: number) => {
  const provider = (window as Window).ethereum
  console.log('===============>', NETWORK_NAME[chainId])
  if (provider && provider.request) {
    try {
      if (chainId === ChainId.MAINNET || chainId === ChainId.ROPSTEN || chainId === ChainId.RINKEBY) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: NETWORK_NAME[chainId],
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: [`${process.env.REACT_APP_NETWORK_URL}`],
              blockExplorerUrls: [`${SCAN_URL[chainId]}/`],
            },
          ],
        });
      } else if (chainId === ChainId.BAOBAB) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: 'Klaytn Baobab',
              nativeCurrency: {
                name: 'klay',
                symbol: 'KLAY',
                decimals: 18,
              },
              rpcUrls: ['https://api.baobab.klaytn.net:8651'],
              blockExplorerUrls: ['https://baobab.scope.klaytn.com/'],
            },
          ],
        });
      } else if (chainId === ChainId.KLAYTN) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: 'Klaytn Mainnet',
              nativeCurrency: {
                name: 'KLAY',
                symbol: 'KLAY',
                decimals: 18,
              },
              rpcUrls: ['https://klaytn.taalswap.info:8651'],
              blockExplorerUrls: ['https://scope.klaytn.com/'],
            },
          ],
        });
      }
    } catch (addError) {
      // handle "add" error
      console.error(addError)
      return false
    }
  } else {
    console.error("Can't setup the ethereum mainnet on metamask because window.ethereum is undefined")
    return false
  }
  return true
}

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (chainId: number) => {
  const provider = (window as Window).ethereum
  if (provider && provider.request) {
    try {
      await addNetwork(chainId)   // Talken
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
      return true
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        await addNetwork(chainId)
      } else if (error.code === 4001) {
        return false
      }
      return true
    }
  } else {
    console.error("Can't setup the ethereum mainnet on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImage: string,
) => {
  const provider = (window as Window).ethereum
  if (provider && provider.request) {
    const tokenAdded = await provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    })
    return tokenAdded
  }
  return null
}
