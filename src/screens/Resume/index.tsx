import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { useTheme } from 'styled-components';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { HistoryCard } from '../../components/HistoryCard';
import { TransactionCardProps } from '../../components/TransactionCard';
import { categories } from '../../utils/categories';
import { moneyFormatter } from '../../utils/formmaters';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  Title,
  MonthSelect,
  PreviousMonthButton,
  SelectIcon,
  Month,
  Content,
  ChartContainer,
  LoadingContainer,
} from './styles';

interface CategoryData {
  name: string;
  totalFormatted: string;
  total: number;
  color: string;
  key: string;
  percentage: string;
}

export const Resume: React.FC = () => {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();
  const { user } = useAuth();

  const dataKey = `@gofinances:transactions_user:${user.id}`;

  const fetchData = async () => {
    const response = await AsyncStorage.getItem(dataKey);
    const parsedResponse = response ? JSON.parse(response) : [];

    const outcomes = parsedResponse.filter(
      (item: TransactionCardProps) =>
        item.type === 'outcome' &&
        new Date(item.date).getMonth() === selectedDate.getMonth() &&
        new Date(item.date).getFullYear() === selectedDate.getFullYear()
    );

    const totalOutcomes = outcomes.reduce(
      (acc: number, outcome: TransactionCardProps) => {
        return acc + Number(outcome.amount);
      },
      0
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      outcomes.forEach((item: TransactionCardProps) => {
        if (item.category === category.key) {
          categorySum += Number(item.amount);
        }
      });

      const percentage = `${((categorySum / totalOutcomes) * 100).toFixed(0)}%`;

      if (categorySum > 0) {
        totalByCategory.push({
          name: category.name,
          totalFormatted: moneyFormatter(categorySum),
          total: categorySum,
          color: category.color,
          key: category.key,
          percentage,
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  };

  const handleChangeDate = (action: 'next' | 'prev') => {
    setIsLoading(true);
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <Content>
          <MonthSelect>
            <PreviousMonthButton onPress={() => handleChangeDate('prev')}>
              <SelectIcon name="chevron-left" />
            </PreviousMonthButton>

            <Month>
              {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
            </Month>

            <PreviousMonthButton onPress={() => handleChangeDate('next')}>
              <SelectIcon name="chevron-right" />
            </PreviousMonthButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              colorScale={totalByCategories.map((item) => item.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={50}
              data={totalByCategories}
              x="percentage"
              y="total"
            />
          </ChartContainer>
          {totalByCategories.map((item) => (
            <HistoryCard
              key={item.key}
              title={item.name}
              amount={item.totalFormatted}
              color={item.color}
            />
          ))}
        </Content>
      )}
    </Container>
  );
};
