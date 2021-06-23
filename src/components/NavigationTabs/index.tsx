import React from 'react';
import styled from 'styled-components';
import { Link as HistoryLink } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import { RowBetween } from 'components/Row';
import QuestionHelper from 'components/QuestionHelper';
import useI18n from 'hooks/useI18n';
import { HelpIcon, useTooltip } from 'taalswap-uikit';

const ReferenceElement = styled.div`
  display: flex;
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
  const TranslateString = useI18n();

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    TranslateString(
      256,
      'Use this tool to find pairs that do not automatically appear in the interface.'
    ),
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
  const TranslateString = useI18n();
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        {/* <HistoryLink to="/pool"> */}
        <HistoryLink to="/liquidity">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>Import Pool</ActiveText>
        <TipFind />
      </RowBetween>
    </Tabs>
  );
}

const TipAdding = ({ adding }: { adding: boolean }) => {
  const TranslateString = useI18n();

  const text = adding
    ? TranslateString(
        264,
        'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'
      )
    : TranslateString(
        266,
        'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
      );

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
  const TranslateString = useI18n();
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        {/* <HistoryLink to="/pool"> */}
        <HistoryLink to="/liquidity">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>
          {adding
            ? TranslateString(258, 'Add')
            : TranslateString(260, 'Remove')}{' '}
          Liquidity
        </ActiveText>
        <TipAdding adding={adding} />
      </RowBetween>
    </Tabs>
  );
}
