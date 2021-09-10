import { ChainId } from 'taalswap-sdk';
import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Button, LinkExternal } from 'taalswap-uikit';
import { ArrowUpCircle } from 'react-feather';
import { useTranslation } from 'contexts/Localization';

import { AutoColumn } from '../Column';
import { getBscScanLink } from '../../utils';
import { ConfirmedIcon, ContentHeader, Section, Wrapper } from './helpers';

type TransactionSubmittedContentProps = {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: ChainId;
};

const TransactionSubmittedContent = ({
  onDismiss,
  chainId,
  hash,
}: TransactionSubmittedContentProps) => {
  const theme = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Section>
        <ContentHeader onDismiss={onDismiss}>
          {t('Transaction submitted')}
        </ContentHeader>
        <ConfirmedIcon>
          <ArrowUpCircle
            strokeWidth={0.5}
            size={97}
            color={theme.colors.primary}
          />
        </ConfirmedIcon>
        <AutoColumn gap="8px" justify="center">
          {chainId && hash && (
            <LinkExternal href={getBscScanLink(chainId, hash, 'transaction')}>
              {chainId > 1000
                ? t('View on Klaytnscope')
                : t('View on Etherscan')}
            </LinkExternal>
          )}
          <Button onClick={onDismiss} mt="20px">
            {t('Close')}
          </Button>
        </AutoColumn>
      </Section>
    </Wrapper>
  );
};

export default TransactionSubmittedContent;
