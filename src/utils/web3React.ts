import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { ConnectorNames } from 'taalswap-uikit'
import Web3 from 'web3'
import { ChainId } from 'taalswap-sdk'
import getNodeUrl from './getRpcUrl'

const POLLING_INTERVAL = 12000
const rpcUrl = getNodeUrl()
// const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)

// const injected = new InjectedConnector({ supportedChainIds: [chainId] })
// TODO: Supporting multi-chains like klaytn
//       all related codes should be modified at first (taalswap-sdk contract addresses, etc.)
//       supportedChainIds: [1] = metamask wallet_switchEthereumChain API works to all others except mainnet
// const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4] })
export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 8217, 1001] })

const walletconnect = new WalletConnectConnector({
  rpc: {
    [ChainId.MAINNET]: rpcUrl,
    [ChainId.KLAYTN]: 'https://klaytn.taalswap.info:8651',
    [ChainId.BAOBAB]: 'https://api.baobab.klaytn.net:8651'
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

// const bscConnector = new BscConnector({ supportedChainIds: [chainId] })
const bscConnector = new BscConnector({ supportedChainIds: [] })

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
}

export const getLibrary = (provider): Web3 => {
  return provider
}
