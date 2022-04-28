import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.TextInput`
  width: 100%;
  padding: 18px 16px;

  font-family: ${(props) => props.theme.fonts.regular};
  font-size: ${RFValue(14)}px;

  color: ${(props) => props.theme.colors.textDark};
  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 4px;
  margin-bottom: 8px;
`;
