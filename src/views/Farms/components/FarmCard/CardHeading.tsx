import React from 'react';
import styled from 'styled-components';
import { Tag, Flex, Heading, Image } from 'taalswap-uikit';
import { CommunityTag } from 'views/Components/Tags';
import CoinImg01 from '../../../../pages/LandingPageView/images/coin_eth_icon.svg';
import CoinImg02 from '../../../../pages/LandingPageView/images/coin_taal_icon.svg';

export interface ExpandableSectionProps {
  lpLabel?: string;
  multiplier?: string;
  isCommunityFarm?: boolean;
  farmImage?: string;
  tokenSymbol?: string;
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`;

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`;

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
  width: 60px;
  height: 60px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 60px;
    height: 60px;
  }
`;

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  isCommunityFarm,
  farmImage,
  tokenSymbol,
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      {/* <Image src={`/images/farms/${farmImage}.svg`} alt={tokenSymbol} width={64} height={64} /> */}
      <IconImageBody>
        <IconImage src={CoinImg01} alt={tokenSymbol} width={60} height={60} />
        <IconImage src={CoinImg02} alt={tokenSymbol} width={60} height={60} />
      </IconImageBody>
      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="15px">{lpLabel.split(' ')[0]}</Heading>
      </Flex>
    </Wrapper>
  );
};

export default CardHeading;
