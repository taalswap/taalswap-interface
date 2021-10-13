import React from 'react';
import styled from 'styled-components';
import { useLastTruthy } from '../../hooks/useLast';
import {
  AdvancedXSwapDetails,
  AdvancedXSwapDetailsProps,
} from './AdvancedXSwapDetails';

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  padding-top: calc(16px + 2rem);
  padding-bottom: 20px;
  margin-top: -2rem;
  width: 100%;
  // max-width: 400px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: ${({ theme }) => theme.colors.textSubtle};
  z-index: 1;

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;

  @media screen and (max-width: 500px) {
    margin-top: 0;
    padding: 0;
  }
`;

export default function AdvancedXSwapDetailsDropdown({
  trade,
  tradeX,
  ...rest
}: AdvancedXSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade);

  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedXSwapDetails
        {...rest}
        trade={trade ?? lastTrade ?? undefined}
        tradeX={tradeX ?? undefined}
      />
    </AdvancedDetailsFooter>
  );
}
