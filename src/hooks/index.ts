import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from 'taalswap-sdk'
import { connectorLocalStorageKey } from 'taalswap-uikit'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
// eslint-disable-next-line import/no-unresolved
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { setupNetwork } from 'utils/wallet'
import { injected } from '../connectors'
import { NetworkContextName } from '../constants'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & { chainId?: ChainId } {
  const context = useWeb3ReactCore<Web3Provider>()
  const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
  return context.active ? context : contextNetwork
}

export function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false)
  const defaultChain = process.env.REACT_APP_CHAIN_ID ?? '1'
  const chainIdStr = window.localStorage.getItem("chainId") ?? defaultChain
  const chainId = parseInt(chainIdStr, 10)

  useEffect( () => {
    injected.isAuthorized().then(async (isAuthorized) => {
      const hasSignedIn = window.localStorage.getItem(connectorLocalStorageKey)
      if (isAuthorized && hasSignedIn) {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!')
        const hasSetup = await setupNetwork(chainId)
        if (hasSetup) {
          activate(injected, undefined, true).catch((error) => {
            setTried(true)
          })
        }
      } else if (isMobile && window.ethereum && hasSignedIn) {
        console.log('@@@@@@@@@@@@@@@@@@@@')
        const hasSetup = await setupNetwork(chainId)
        if (hasSetup) {
          activate(injected, undefined, true).catch((error) => {
            setTried(true)
          })
        } else {
          setTried(true)
        }
      }
    })
  }, [activate, chainId]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}


/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((e) => {
          console.error('Failed to activate after chain changed', e)
        })
      }

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((e) => {
            console.error('Failed to activate after accounts changed', e)
          })
        }
      }

      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate])
}
