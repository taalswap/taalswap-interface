import { useMemo } from 'react';
import { Contract } from '@ethersproject/contracts';
import { ChainId, WETH } from 'taalswap-sdk';
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import {
  getBep20Contract,
  getCakeContract,
  getBunnyFactoryContract,
  getBunnySpecialContract,
  getPancakeRabbitContract,
  getProfileContract,
  getIfoV1Contract,
  getIfoV2Contract,
  getLotteryContract,
  getLotteryTicketContract,
  getMasterchefContract,
  getPointCenterIfoContract,
  getSouschefContract,
  getClaimRefundContract,
  getTradingCompetitionContract,
  getEasterNftContract,
  getErc721Contract,
  getCakeVaultContract,
  getPredictionsContract,
  getChainlinkOracleContract,
  getSouschefV2Contract,
  getLotteryV2Contract,
} from 'utils/contractHelpers';
import ENS_ABI from '../constants/abis/ens-registrar.json';
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json';
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20';
import ERC20_ABI from '../constants/abis/erc20.json';
import WETH_ABI from '../constants/abis/weth.json';
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall';
import { getContract } from '../utils';
import { useActiveWeb3React } from './index';
// import useWeb3 from 'hooks/useWeb3';

import useWeb3 from './useWeb3';

// returns null on errors
function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
  selectedChainId?: ChainId
): Contract | null {
  const { library, account } = useActiveWeb3React();
  let { chainId } = useActiveWeb3React();
  if (selectedChainId) chainId = selectedChainId;

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined,
        chainId,
        !!selectedChainId
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [
    address,
    ABI,
    library,
    withSignerIfPossible,
    account,
    chainId,
    selectedChainId,
  ]);
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId ? WETH[chainId].address : undefined,
    WETH_ABI,
    withSignerIfPossible
  );
}

export function useENSRegistrarContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(
  address: string | undefined,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function usePairContract(
  pairAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible);
}

export function useMulticallContract(
  selectedChianId?: ChainId
): Contract | null {
  let { chainId } = useActiveWeb3React();
  if (selectedChianId) {
    chainId = selectedChianId;
  }
  return useContract(
    chainId && MULTICALL_NETWORKS[chainId],
    MULTICALL_ABI,
    false,
    chainId
  );
}

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getIfoV1Contract(address, web3), [address, web3]);
};

export const useIfoV2Contract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getIfoV2Contract(address, web3), [address, web3]);
};

export const useERC20 = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getBep20Contract(address, web3), [address, web3]);
};

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getErc721Contract(address, web3), [address, web3]);
};

export const useCake = () => {
  const web3 = useWeb3();
  return useMemo(() => getCakeContract(web3), [web3]);
};

export const useBunnyFactory = () => {
  const web3 = useWeb3();
  return useMemo(() => getBunnyFactoryContract(web3), [web3]);
};

export const usePancakeRabbits = () => {
  const web3 = useWeb3();
  return useMemo(() => getPancakeRabbitContract(web3), [web3]);
};

export const useProfile = () => {
  const web3 = useWeb3();
  return useMemo(() => getProfileContract(web3), [web3]);
};

export const useLottery = () => {
  const web3 = useWeb3();
  return useMemo(() => getLotteryContract(web3), [web3]);
};

export const useLotteryTicket = () => {
  const web3 = useWeb3();
  return useMemo(() => getLotteryTicketContract(web3), [web3]);
};

export const useLotteryV2Contract = () => {
  const web3 = useWeb3();
  return useMemo(() => getLotteryV2Contract(web3), [web3]);
};

export const useMasterchef = () => {
  const web3 = useWeb3();
  return useMemo(() => getMasterchefContract(web3), [web3]);
};

export const useSousChef = (id) => {
  const web3 = useWeb3();
  return useMemo(() => getSouschefContract(id, web3), [id, web3]);
};

export const useSousChefV2 = (id) => {
  const web3 = useWeb3();
  return useMemo(() => getSouschefV2Contract(id, web3), [id, web3]);
};

export const usePointCenterIfoContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getPointCenterIfoContract(web3), [web3]);
};

export const useBunnySpecialContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getBunnySpecialContract(web3), [web3]);
};

export const useClaimRefundContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getClaimRefundContract(web3), [web3]);
};

export const useTradingCompetitionContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getTradingCompetitionContract(web3), [web3]);
};

export const useEasterNftContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getEasterNftContract(web3), [web3]);
};

export const useCakeVaultContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getCakeVaultContract(web3), [web3]);
};

export const usePredictionsContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getPredictionsContract(web3), [web3]);
};

export const useChainlinkOracleContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getChainlinkOracleContract(web3), [web3]);
};
