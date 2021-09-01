import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import AddLiquidity from './index'
import getChainId from "../../utils/getChainId";
import {setupNetwork} from "../../utils/wallet";

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/
export function RedirectOldAddLiquidityPathStructure(props: RouteComponentProps<{ currencyIdA: string }>) {
  const {
    match: {
      params: { currencyIdA },
    },
  } = props
  const match = currencyIdA.match(OLD_PATH_STRUCTURE)
  if (match?.length) {
    return <Redirect to={`/add/${match[1]}/${match[2]}`} />
  }

  return <AddLiquidity {...props} />
}

export function RedirectDuplicateTokenIds(props: RouteComponentProps<{ chainId: string; currencyIdA: string; currencyIdB: string }>) {
  const {
    match: {
      params: { chainId, currencyIdA, currencyIdB },
    },
  } = props
  const curChainId = getChainId()
  if (curChainId !== parseInt(chainId)) {
    window.localStorage.setItem("chainId", chainId)
    setupNetwork(parseInt(chainId))
  }
  if (currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    return <Redirect to={`/add/${currencyIdA}`} />
  }
  return <AddLiquidity {...props} />
}
