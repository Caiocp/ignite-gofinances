import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

import { SocialSigninButton } from '../../components/SocialSigninButton';
import { useAuth } from '../../hooks/auth';
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SigninTitle,
  Footer,
  FooterWrapper,
} from './styles';

export const Signin: React.FC = () => {
  const data = useAuth();

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />

          <Title>
            Controle suas{'\n'}finanças de forma{'\n'}muito simples
          </Title>
        </TitleWrapper>

        <SigninTitle>Faça seu login com{'\n'}uma das contas abaixo</SigninTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SocialSigninButton title="Entrar com Google" svg={GoogleSvg} />
          <SocialSigninButton title="Entrar com Apple" svg={AppleSvg} />
        </FooterWrapper>
      </Footer>
    </Container>
  );
};
