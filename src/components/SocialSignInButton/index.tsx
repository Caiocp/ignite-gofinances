import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { Button, ButtonContainer, ImageContainer, Title } from './styles';

interface Props extends TouchableOpacityProps {
  title: string;
  svg: React.FC<SvgProps>;
}

export const SocialSignInButton = ({ title, svg: Svg, ...rest }: Props) => {
  return (
    <Button {...rest}>
      <ButtonContainer>
        <ImageContainer>
          <Svg />
        </ImageContainer>
        <Title>{title}</Title>
      </ButtonContainer>
    </Button>
  );
};
