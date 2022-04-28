import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { Container, Icon, Title } from './styles';

const icons = {
  income: 'arrow-up-circle',
  outcome: 'arrow-down-circle',
};

interface Props extends TouchableOpacityProps {
  type: 'income' | 'outcome';
  title: string;
  isActive: boolean;
}

export const TransactionTypeButton = ({
  title,
  type,
  isActive,
  ...rest
}: Props) => {
  return (
    <Container isActive={isActive} type={type} {...rest}>
      <Icon name={icons[type]} type={type} />
      <Title>{title}</Title>
    </Container>
  );
};
