import React, { useCallback, useEffect, useState } from 'react';
import { ChainId } from 'taalswap-sdk';
import styled from 'styled-components';
import { useSwapState } from 'state/swap/hooks';
import { useActiveWeb3React } from 'hooks';

const NetworkSelectBox = styled.select`
  width: 180px;
  height: auto;
  min-height: 30px;
  position: relative;
  border: 1px solid #dce0e4;
  border-radius: 5px;
  background-color: #fff;
  margin-left: 15px;

  @media screen and (max-width: 500px) {
    margin-left: 0px;
    margin-bottom: 10px;
  }
`;

const NetworkSelector = ({ onSetCrossChain, id }) => {
  const { crossChain } = useSwapState();
  const { chainId } = useActiveWeb3React();

  if (window.localStorage.getItem('chainId') === null && chainId !== undefined)
    window.localStorage.setItem('chainId', chainId?.toString());

  const currentChainId = window.localStorage.getItem('chainId');
  const crossChainId = window.localStorage.getItem('crossChain') ?? 0;
  const crossChainConf = parseInt(
    process.env.REACT_APP_KLAYTN_ID ?? '',
    10
  ) as ChainId;
  // const [selectedChainId, setSelectedChainId] = useState(() =>
  //   id === 'swap-currency-input' ? currentChainId : 0
  // );

  const [selectedChainId, setSelectedChainId] = useState(() =>
    id === 'swap-currency-input' ? currentChainId : crossChainId
  );
  const networkList = [
    {
      id: 0,
      name: 'Select Network',
      chainId: 0,
    },
    {
      id: 1,
      name: 'Ethereum',
      chainId: ChainId.ROPSTEN,
    },
    {
      id: 2,
      name: 'Klaytn',
      chainId: crossChainConf,
    },
  ];

  const handleSelect = (e) => {
    if (id === 'swap-currency-output') {
      // setSelectedChainId(parseInt(e.target.value));
      setSelectedChainId(e.target.value);
      onSetCrossChain(parseInt(e.target.value));
      window.localStorage.setItem('crossChain', e.target.value);
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', removeCrossChainId);
    return () => {
      window.removeEventListener('beforeunload', removeCrossChainId);
    };
  }, []);

  const removeCrossChainId = (e) => {
    window.localStorage.removeItem('crossChain');
  };

  useEffect(() => {
    if (id === 'swap-currency-input') {
      setSelectedChainId(currentChainId);
    }

    if (id === 'swap-currency-output' && crossChainId !== null) {
      setSelectedChainId(crossChainId);
      onSetCrossChain(crossChainId);
      window.localStorage.setItem('prevChainId', crossChainId?.toString());
    }
  }, [currentChainId, crossChainId, onSetCrossChain, id]);

  // useEffect(() => {
  //   return () => {
  //     window.localStorage.removeItem('crossChain');
  //   };
  // }, []);

  return (
    <>
      <NetworkSelectBox
        onChange={handleSelect}
        disabled={id === 'swap-currency-input'}
        value={selectedChainId !== null ? selectedChainId : 0}
      >
        {networkList.map((network) => (
          <option
            key={network.id}
            value={network.chainId}
            label={network.name}
          />
        ))}
      </NetworkSelectBox>
    </>
  );
};

export default NetworkSelector;
