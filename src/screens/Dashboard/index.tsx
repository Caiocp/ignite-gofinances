import React from 'react';

import { HighlightCard } from '../../components/HighlightCard';
import {
  TransactionCard,
  TransactionCardProps,
} from '../../components/TransactionCard';
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreetings,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

const Dashboard: React.FC = () => {
  const data: DataListProps[] = [
    {
      id: '1',
      type: 'income',
      title: 'Desenvolvimento de app',
      amount: 'R$ 12.000,00',
      category: { name: 'Vendas', icon: 'dollar-sign' },
      date: '27/04/2022',
    },
    {
      id: '2',
      type: 'outcome',
      title: 'placa de vídeo',
      amount: 'R$ 2.000,00',
      category: { name: 'Compra', icon: 'shopping-bag' },
      date: '27/04/2022',
    },
    {
      id: '3',
      type: 'income',
      title: 'Desenvolvimento de site',
      amount: 'R$ 10.000,00',
      category: { name: 'Vendas', icon: 'dollar-sign' },
      date: '27/04/2022',
    },
    {
      id: '4',
      type: 'outcome',
      title: 'Burgão da massa',
      amount: 'R$ 40,00',
      category: { name: 'Alimentação', icon: 'coffee' },
      date: '27/04/2022',
    },
  ];

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{
                uri: 'https://avatars.githubusercontent.com/u/19747459?v=4',
              }}
            />
            <User>
              <UserGreetings>Olá, </UserGreetings>
              <UserName>Caio</UserName>
            </User>
          </UserInfo>

          <Icon name="power" />
        </UserWrapper>
      </Header>

      <HighlightCards
        decelerationRate={0}
        snapToInterval={350}
        snapToAlignment="center"
      >
        <HighlightCard
          type="income"
          title="Entradas"
          amount="R$ 16.100,00"
          lastTransaction="Última entrada dia 13 de abril "
        />
        <HighlightCard
          type="outcome"
          title="Saídas"
          amount="R$ 16.100,00"
          lastTransaction="Última saída dia 03 de abril"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount="R$ 16.100,00"
          lastTransaction="01 à 16 de abril"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionsList
          data={data}
          renderItem={({ item }) => <TransactionCard data={item} />}
          keyExtractor={(item) => item.id}
        />
      </Transactions>
    </Container>
  );
};

export default Dashboard;
