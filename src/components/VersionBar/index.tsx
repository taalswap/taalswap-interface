import React from 'react';
import styled from 'styled-components';
import {
  Button,
  ButtonMenu,
  ButtonMenuItem,
  HelpIcon,
  Link,
  Text,
} from 'taalswap-uikit';

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background-color: ${({ theme }) => theme.colors.tertiary};
  padding: 16px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 240px;
  }
`;

const interfaceBaseUrl =
  process.env.REACT_APP_INTERFACE || 'http://localhost:3000';

const VersionBar = () => {
  return (
    <Wrapper>
      <Text bold mr="16px">
        Version:
      </Text>
      <ButtonMenu variant="primary" scale="sm" activeIndex={1}>
        {/* <ButtonMenuItem as='a' href='http://localhost:3000/'> */}
        <ButtonMenuItem as="a" href={`${interfaceBaseUrl}`}>
          V2
        </ButtonMenuItem>
        <ButtonMenuItem as="a" href="https://v1exchange.pancakeswap.finance/#/">
          V1 (old)
        </ButtonMenuItem>
      </ButtonMenu>
      <Button
        variant="subtle"
        as={Link}
        href="https://v1exchange.pancakeswap.finance/#/migrate"
        endIcon={<HelpIcon color="white" />}
        scale="sm"
        ml="16px"
      >
        Help
      </Button>
    </Wrapper>
  );
};

export default VersionBar;
