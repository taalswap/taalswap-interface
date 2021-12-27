import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard';
import { useMatchBreakpoints } from 'taalswap-uikit';
import { useTranslation } from 'contexts/Localization';
import useDelayedUnmount from 'hooks/useDelayedUnmount';
import { useFarmUser } from 'state/hooks';

import Apr, { AprProps } from './Apr';
import Farm, { FarmProps } from './Farm';
import Earned, { EarnedProps } from './Earned';
import Details from './Details';
import Multiplier, { MultiplierProps } from './Multiplier';
import Liquidity, { LiquidityProps } from './Liquidity';
import ActionPanel from './Actions/ActionPanel';
import CellLayout from './CellLayout';
import { DesktopColumnSchema, MobileColumnSchema } from '../types';

export interface RowProps {
  apr: AprProps;
  farm: FarmProps;
  earned: EarnedProps;
  multiplier: MultiplierProps;
  liquidity: LiquidityProps;
  details: FarmWithStakedValue;
  isLandingPage: boolean;
}

interface RowPropsWithLoading extends RowProps {
  userDataReady: boolean;
  // multiplierAvg: number
}

const cells = {
  apr: Apr,
  farm: Farm,
  earned: Earned,
  details: Details,
  // multiplier: Multiplier,
  liquidity: Liquidity,
};

const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 16px;
  }
`;

const StyledTr = styled.tr`
  cursor: pointer;
`;

const EarnedMobileCell = styled.td`
  padding: 16px 0 24px 16px;
`;

const AprMobileCell = styled.td`
  padding-top: 16px;
  padding-bottom: 24px;
`;

const FarmMobileCell = styled.td`
  padding-top: 24px;
`;

const Row: React.FunctionComponent<RowPropsWithLoading> = (props) => {
  const { details, userDataReady, isLandingPage } = props;
  const hasStakedAmount = !!useFarmUser(details.pid).stakedBalance.toNumber();
  const [actionPanelExpanded, setActionPanelExpanded] =
    useState(hasStakedAmount);
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300);

  const { t } = useTranslation();

  const toggleActionPanel = () => {
    setActionPanelExpanded(!actionPanelExpanded);
  };

  useEffect(() => {
    if (isLandingPage) {
      setActionPanelExpanded(false);
    } else {
      setActionPanelExpanded(hasStakedAmount);
    }
  }, [hasStakedAmount, isLandingPage]);

  const { isXl, isXs } = useMatchBreakpoints();

  const isMobile = !isXl;
  const tableSchema = isMobile ? MobileColumnSchema : DesktopColumnSchema;
  const columnNames = tableSchema.map((column) => column.name);

  const handleRenderRow = () => {
    if (!isXs) {
      return (
        <StyledTr onClick={toggleActionPanel}>
          {Object.keys(props).map((key) => {
            const columnIndex = columnNames.indexOf(key);
            if (columnIndex === -1) {
              return null;
            }

            switch (key) {
              case 'details':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout>
                        <Details actionPanelToggled={actionPanelExpanded} />
                      </CellLayout>
                    </CellInner>
                  </td>
                );
              case 'apr':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout>
                        <Apr {...props.apr} hideButton={isMobile} />
                      </CellLayout>
                    </CellInner>
                  </td>
                );
              case 'multiplier':
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout>
                        <Multiplier {...props.multiplier} />
                      </CellLayout>
                    </CellInner>
                  </td>
                );
              default:
                return (
                  <td key={key}>
                    <CellInner>
                      <CellLayout>
                        {React.createElement(cells[key], {
                          ...props[key],
                          userDataReady,
                        })}
                      </CellLayout>
                    </CellInner>
                  </td>
                );
            }
          })}
        </StyledTr>
      );
    }

    return (
      <StyledTr onClick={toggleActionPanel}>
        <td colSpan={3}>
          <tr style={{ borderBottom: '0' }}>
            <FarmMobileCell colSpan={2}>
              <CellLayout>
                <Farm {...props.farm} />
              </CellLayout>
            </FarmMobileCell>
          </tr>
          <tr>
            <EarnedMobileCell colSpan={3}>
              <CellLayout>
                <Earned {...props.earned} userDataReady={userDataReady} />
              </CellLayout>
            </EarnedMobileCell>
            <AprMobileCell>
              <CellLayout>
                <Apr {...props.apr} hideButton />
              </CellLayout>
            </AprMobileCell>
          </tr>
        </td>
        <td>
          <CellInner>
            <CellLayout>
              <Details actionPanelToggled={actionPanelExpanded} />
            </CellLayout>
          </CellInner>
        </td>
      </StyledTr>
    );
  };

  return (
    <>
      {handleRenderRow()}
      {shouldRenderChild && (
        <tr>
          <td colSpan={6}>
            <ActionPanel {...props} expanded={actionPanelExpanded} />
          </td>
        </tr>
      )}
    </>
  );
};

export default Row;
