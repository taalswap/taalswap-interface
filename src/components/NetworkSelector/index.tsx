import React, { useCallback, useEffect, useState } from 'react';
import { ChainId } from 'taalswap-sdk';
import styled from 'styled-components';
import { useSwapState } from 'state/swap/hooks';

const NetworkSelectBox = styled.select``;

const NetworkSelector = ({ onSetCrossChain, id }) => {
  const { crossChain } = useSwapState();
  const currentChainId = window.localStorage.getItem('chainId');
  const [selectedChainId, setSelectedChainId] = useState(() =>
    id === 'swap-currency-input' ? currentChainId : 0
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
      chainId: ChainId.BAOBAB,
    },
  ];

  const handleSelect = (e) => {
    if (id === 'swap-currency-output') {
      console.log(selectedChainId);
      setSelectedChainId(parseInt(e.target.value));
      onSetCrossChain(parseInt(e.target.value));
      window.localStorage.setItem('crossChain', e.target.value);
    }
  };

  useEffect(() => {
    if (id === 'swap-currency-input') {
      setSelectedChainId(currentChainId);
    }
  }, [currentChainId, id]);

  return (
    <NetworkSelectBox
      onChange={handleSelect}
      disabled={id === 'swap-currency-input'}
      value={selectedChainId !== null ? selectedChainId : 0}
    >
      {networkList.map((network) => (
        <option key={network.id} value={network.chainId} label={network.name} />
      ))}
    </NetworkSelectBox>
  );
};

export default NetworkSelector;
