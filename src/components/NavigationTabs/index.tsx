import React from 'react';
import styled from 'styled-components';
import { Link as HistoryLink } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import { RowBetween } from 'components/Row';
import { HelpIcon, useTooltip } from 'taalswap-uikit';
import { useTranslation } from '../../contexts/Localization';

const ReferenceElement = styled.div`
  display: flex;
  margin-left: 0.3rem;
`;

const Tabs = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`;

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`;

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.colors.text};
`;

const TipFind = () => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
   t('Use this tool to find pairs that do not automatically appear in the interface.'),
    { placement: 'top-end', tooltipOffset: [20, 10] }
  );

  return (
    <div>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </div>
  );
};

export function FindPoolTabs() {
  const { t } = useTranslation();
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        {/* <HistoryLink to="/pool"> */}
        <HistoryLink to="/liquidity">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{t('Import Pool')}</ActiveText>
        <TipFind />
      </RowBetween>
    </Tabs>
  );
}

const TipAdding = ({ adding }: { adding: boolean }) => {
  const { t } = useTranslation();
  const text = adding
    ? t('When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.')
    : t('Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.');

  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  });

  return (
    <div>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </div>
  );
};

export function AddRemoveTabs({ adding }: { adding: boolean }) {
  const { t } = useTranslation();
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        {/* <HistoryLink to="/pool"> */}
        <HistoryLink to="/liquidity">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>
          {adding
            ? t('Add Liquidity')
            : t('Remove Liquidity')}
        </ActiveText>
        <TipAdding adding={adding} />
      </RowBetween>
    </Tabs>
  );
}
