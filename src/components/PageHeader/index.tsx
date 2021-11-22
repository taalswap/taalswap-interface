import React, { ReactNode } from 'react';
import styled from 'styled-components';
import {
  BackgroundImage,
  Flex,
  Heading,
  HistoryIcon,
  IconButton,
  Text,
  TuneIcon,
  useModal,
} from 'taalswap-uikit';
import SettingsModal from './SettingsModal';
import RecentTransactionsModal from './RecentTransactionsModal';
import { useTranslation } from '../../contexts/Localization';
import OptionIcon from '../../pages/Swap/images/option_icon.svg';
import Disclosure from '../../pages/Swap/images/disclosure.svg';
import Bridge from '../../pages/XSwap/images/bridge.svg';
import RecentXSwapTransactionsModal from './RecentXSwapTransactionsModal';

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}
/* to do */
const StyledPageHeader = styled.div`
  border-bottom: 0px solid ${({ theme }) => theme.colors.disabled};
  padding: 0px 0px 24px 0px;
  width: 100%;
  max-width: 1070px;

  @media screen and (max-width: 500px) {
    padding-bottom: 0.6875rem;
  }
`;

const Details = styled.div`
  flex: 1;
`;

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  const { t } = useTranslation();
  const [onPresentSettings] = useModal(<SettingsModal />);
  const [onPresentRecentTransactions] = useModal(<RecentTransactionsModal />);
  const [onPresentRecentXSwapTransactions] = useModal(
    <RecentXSwapTransactionsModal />
  );

  return (
    <StyledPageHeader>
      <Flex alignItems="center">
        <Details>
          <Heading mb="8px">{title}</Heading>
          {description && (
            <Text color="#a7b2b3" fontSize="14px">
              {description}
            </Text>
          )}
        </Details>
        <IconButton
          variant="text"
          onClick={onPresentRecentXSwapTransactions}
          title={t('Recent X-Swap transactions')}
        >
          {/* <HistoryIcon width='24px' color='#00ab55' /> */}
          <img src={Bridge} alt="option_icon" className="" />
        </IconButton>
        <IconButton
          variant="text"
          onClick={onPresentSettings}
          title={t('Settings')}
        >
          {/* <TuneIcon width='24px' color='#00ab55' /> */}
          <img src={OptionIcon} alt="option_icon" className="" />
        </IconButton>
        <IconButton
          variant="text"
          onClick={onPresentRecentTransactions}
          title={t('Recent transactions')}
        >
          {/* <HistoryIcon width='24px' color='#00ab55' /> */}
          <img src={Disclosure} alt="option_icon" className="" />
        </IconButton>
      </Flex>
      {children && <Text mt="16px">{children}</Text>}
    </StyledPageHeader>
  );
};

export default PageHeader;
