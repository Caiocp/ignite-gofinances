import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';

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
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LoadingContainer,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}
interface HighlightedData {
  entries: HighlightProps;
  outgoings: HighlightProps;
  total: HighlightProps;
}

export const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightedData>(
    {} as HighlightedData
  );

  const theme = useTheme();

  const dataKey = '@gofinances:transactions';

  const getLastTransactionDate = (
    collection: DataListProps[],
    type: 'income' | 'outcome'
  ) => {
    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        collection
          .filter((item) => item.type === type)
          .map((item) => new Date(item.date).getTime())
      )
    );
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      'pt-BR',
      { month: 'long' }
    )} `;
  };

  const fetchTransactions = async () => {
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let incomeBalance = 0;
    let outcomeBalance = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (transaction: DataListProps) => {
        if (transaction.type === 'income') {
          incomeBalance += Number(transaction.amount);
        } else {
          outcomeBalance += Number(transaction.amount);
        }

        const amount = Number(transaction.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const dateFormatted = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(transaction.date));

        return {
          ...transaction,
          amount,
          date: dateFormatted,
        };
      }
    );
    setData(transactionsFormatted);

    const lastIncomingTransactions = getLastTransactionDate(
      transactions,
      'income'
    );
    const lastOutgoingTransactions = getLastTransactionDate(
      transactions,
      'outcome'
    );
    const teste = new Date(
      Math.min.apply(
        Math,
        transactions
          .filter((item: DataListProps) => item.type === 'income')
          .map((item: DataListProps) => new Date(item.date).getTime())
      )
    ).getDate();
    console.log(teste);
    const totalInterval = `${teste} a ${lastOutgoingTransactions}`;

    setHighlightData({
      entries: {
        amount: incomeBalance.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `Última entrada dia ${lastIncomingTransactions}`,
      },
      outgoings: {
        amount: outcomeBalance.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `Última entrada dia ${lastOutgoingTransactions}`,
      },
      total: {
        amount: (incomeBalance - outcomeBalance).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval,
      },
    });

    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    // AsyncStorage.removeItem(dataKey);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <>
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

              <LogoutButton
                onPress={() => {
                  BackHandler.exitApp();
                }}
              >
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type="income"
              title="Entradas"
              amount={highlightData?.entries?.amount}
              lastTransaction={highlightData?.entries?.lastTransaction}
            />
            <HighlightCard
              type="outcome"
              title="Saídas"
              amount={highlightData?.outgoings?.amount}
              lastTransaction={highlightData?.outgoings?.lastTransaction}
            />
            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData?.total?.amount}
              lastTransaction={highlightData?.total?.lastTransaction}
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
        </>
      )}
    </Container>
  );
};
