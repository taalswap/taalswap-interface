import React, { useEffect, useRef } from 'react';
import { useCountUp } from 'react-countup';
import { Text } from 'taalswap-uikit';

export interface CardValueProps {
  value: number;
  decimals?: number;
  fontSize?: string;
  lineHeight?: string;
  prefix?: string;
  bold?: boolean;
  color?: string;
  marginRight?: string;
  fontWeight?: string;
}

const CardValue: React.FC<CardValueProps> = ({
  value,
  decimals,
  fontSize = '40px',
  lineHeight = '1',
  prefix = '',
  bold = true,
  color = 'text',
  marginRight,
  fontWeight,
}) => {
  // @ts-ignore
  const { countUp, update } = useCountUp({
    start: 0,
    end: value,
    duration: 1,
    separator: ',',
    decimals:
      // eslint-disable-next-line no-nested-ternary
      decimals !== undefined ? decimals : value < 0 ? 4 : value > 1e5 ? 0 : 2,
  });

  const updateValue = useRef(update);

  useEffect(() => {
    updateValue.current(value);
  }, [value, updateValue]);

  return (
    <Text
      bold={bold}
      fontSize={fontSize}
      style={{ lineHeight, padding: 0 }}
      color={color}
      marginRight={marginRight}
      fontWeight={fontWeight}
    >
      {prefix}
      {countUp}
    </Text>
  );
};

export default CardValue;
