import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useFarmUser } from 'state/hooks';
import { useTranslation } from 'contexts/Localization';
import { Text, Image } from 'taalswap-uikit';
import { getBalanceNumber } from 'utils/formatBalance';
import { ChainId } from 'taalswap-sdk';
import CoinImg01 from '../../../../pages/LandingPageView/images/coin_eth_icon.svg';
import CoinImg02 from '../../../../pages/LandingPageView/images/coin_taal_icon.svg';

export interface FarmProps {
  label: string;
  pid: number;
  image: string;
}

const IconImageBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  > div:nth-child(1) {
    z-index: 2;
  }
  > div:nth-child(2) {
    margin-left: -15px;
    z-index: 1;
  }
`;

const IconImage = styled(Image)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #e3e1e1;

  /*
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
  }
  */
`;

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;
  max-width: atuo;

  ${({ theme }) => theme.mediaQueries.sm} {
  }
`;

const Farm: React.FunctionComponent<FarmProps> = ({ image, label, pid }) => {
  const { stakedBalance } = useFarmUser(pid);
  const { t } = useTranslation();
  const [icons, setIcons] = useState([]);

  const interfaceBaseUrl =
    process.env.REACT_APP_INTERFACE || 'http://localhost:3000';

  const rawStakedBalance = getBalanceNumber(stakedBalance);
  const chainId = window.localStorage.getItem('chainId');
  const handleRenderFarming = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Farming')}
        </Text>
      );
    }

    return null;
  };

  const getIconPath = useMemo(() => {
    const symbols = label.split('-');
    let url;
    const iconPath = symbols.map((symbol) => {
      // if (
      //   chainId === ChainId.MAINNET.toString() ||
      //   chainId === ChainId.RINKEBY.toString() ||
      //   chainId === ChainId.ROPSTEN.toString()
      // ) {
      //   url =
      //     symbol === 'ETH' || symbol === 'WETH'
      //       ? `https://taalswap.info/images/coins/${symbol}.png`
      //       : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${symbol}/logo.png`
      // } else {
      //   url = `${process.env.REACT_APP_INTERFACE}/images/coins/${symbol.toLowerCase()}.svg`
      // }
      // url = `https://swap.taalswap.finance/images/coins/${symbol.toLowerCase()}.png`
      url = `${interfaceBaseUrl}/images/coins/${symbol.toLowerCase()}.png`;
      return url;
    });

    // setIcons(iconPath)
    return iconPath;
  }, [label, interfaceBaseUrl]);

  return (
    <Container>
      {/* <IconImage src={`/images/farms/${image}.svg`} alt="icon" width={40} height={40} mr="8px" /> */}
      <IconImageBody>
        <IconImage
          src={getIconPath[0]}
          alt="icon"
          width={40}
          height={40}
          mr="8px"
        />
        <IconImage
          src={getIconPath[1]}
          alt="icon"
          width={40}
          height={40}
          mr="8px"
        />
      </IconImageBody>
      <div style={{ width: '100%' }}>
        {handleRenderFarming()}
        <Text bold fontSize="14px">
          {label}
        </Text>
      </div>
    </Container>
  );
};

export default Farm;
