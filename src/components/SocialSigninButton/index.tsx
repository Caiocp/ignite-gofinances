import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { Button, ButtonContainer, ImageContainer, Title } from './styles';

interface Props extends TouchableOpacityProps {
  title: string;
  svg: React.FC<SvgProps>;
}

export const SocialSigninButton = ({ title, svg: Svg }: Props) => {
  return (
    <Button onPress={() => {}}>
      <ButtonContainer>
        <ImageContainer>
          <Svg />
        </ImageContainer>
        <Title>{title}</Title>
      </ButtonContainer>
    </Button>
  );
};
