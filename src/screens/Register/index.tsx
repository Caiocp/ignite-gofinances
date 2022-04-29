import React, { useState } from 'react';
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useNavigation, NavigationProp } from '@react-navigation/core';

import { Button } from '../../components/Form/Button';
import { InputForm } from '../../components/Form/InputForm';
import { CategorySelect } from '../CategorySelect';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';

import { AppRoutesParamList } from '../../@types/routes/app.routes';
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles';
import { useAuth } from '../../hooks/auth';

interface FormData {
  [key: string]: string;
}

const schema = yup.object().shape({
  name: yup.string().required('O nome é obrigatório'),
  amount: yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório'),
});

export const Register: React.FC = () => {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const { user } = useAuth();

  const navigation = useNavigation<NavigationProp<AppRoutesParamList>>();

  const dataKey = `@gofinances:transactions_user:${user.id}`;

  const handleSelectTransactionTypeSelect = (type: 'income' | 'outcome') => {
    setTransactionType(type);
  };

  const handeOpenSelectCategoryModal = () => {
    setCategoryModalOpen(true);
  };

  const handeCloseSelectCategoryModal = () => {
    setCategoryModalOpen(false);
  };

  const handleRegister = async (form: FormData) => {
    if (!transactionType) {
      return Alert.alert('Erro', 'Selecione o tipo de transação');
    }

    if (category.key === 'category') {
      return Alert.alert('Erro', 'Selecione uma categoria');
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const transactions = await fetchData(dataKey);
      const currentData = transactions ? transactions : [];

      await AsyncStorage.setItem(
        dataKey,
        JSON.stringify([...currentData, newTransaction])
      );

      reset();
      setTransactionType('');
      setCategory({ key: 'category', name: 'Categoria' });

      navigation.navigate('Listagem');
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar');
    }
  };

  const fetchData = async (dataKey: string) => {
    const data = await AsyncStorage.getItem(dataKey);
    return JSON.parse(data!);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              control={control}
              name="name"
              placeholder="nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              control={control}
              name="amount"
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionsTypes>
              <TransactionTypeButton
                type="income"
                title="Income"
                onPress={() => handleSelectTransactionTypeSelect('income')}
                isActive={transactionType === 'income'}
              />
              <TransactionTypeButton
                type="outcome"
                title="Outcome"
                onPress={() => handleSelectTransactionTypeSelect('outcome')}
                isActive={transactionType === 'outcome'}
              />
            </TransactionsTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handeOpenSelectCategoryModal}
            />
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={categoryModalOpen} animationType="slide">
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handeCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
};
