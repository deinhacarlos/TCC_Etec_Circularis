// src/screens/TrocasScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import styles from '../styles/TrocasStyles';
import { apiGetAuth } from '../Api';
import TermsFooter from '../components/TermsFooter';

export default function TrocasScreen({ navigation }) {
  const [trocas, setTrocas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarTrocas = async () => {
    try {
      setLoading(true);
      // mesma ideia do trocas-script: busca trocas do usuário logado
      const res = await apiGetAuth('/trocas/minhas'); // ajuste a rota se for outra

      if (Array.isArray(res)) {
        setTrocas(res);
      } else if (Array.isArray(res?.trocas)) {
        setTrocas(res.trocas);
      } else {
        setTrocas([]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar suas trocas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarTrocas);
    return unsubscribe;
  }, [navigation]);

  const getStatusLabel = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pendente':
        return 'Pendente';
      case 'aceita':
      case 'aceito':
        return 'Aceita';
      case 'recusada':
      case 'recusado':
        return 'Recusada';
      case 'concluida':
      case 'concluído':
        return 'Concluída';
      default:
        return status || 'Desconhecido';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Minhas Trocas</Text>
        <Text style={styles.subtitle}>
          Acompanhe as trocas de livros que você solicitou ou recebeu.
        </Text>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#00A86B" />
            <Text style={styles.helperText}>Carregando trocas...</Text>
          </View>
        )}

        {!loading && trocas.length === 0 && (
          <View style={styles.center}>
            <Text style={styles.helperTitle}>Você ainda não tem trocas.</Text>
            <Text style={styles.helperText}>
              Proponha trocas a partir da tela de livros disponíveis.
            </Text>
          </View>
        )}

        {!loading &&
          trocas.map((troca) => (
            <View
              key={troca.Id_Troca || troca.id}
              style={styles.card}
            >
              <Text style={styles.cardStatus}>
                Status: {getStatusLabel(troca.Status || troca.status)}
              </Text>

              <Text style={styles.cardLabel}>Seu material:</Text>
              <Text style={styles.cardText}>
                {troca.MaterialUsuarioTitulo || troca.Material_Usuario_Titulo}
              </Text>

              <Text style={styles.cardLabel}>Material do outro usuário:</Text>
              <Text style={styles.cardText}>
                {troca.MaterialOutroTitulo || troca.Material_Outro_Titulo}
              </Text>

              {troca.NomeOutroUsuario && (
                <Text style={styles.cardUser}>
                  Usuário: {troca.NomeOutroUsuario}
                </Text>
              )}
            </View>
          ))}
      </ScrollView>

      <TermsFooter
        onPressTerms={() => navigation.navigate('Termos')}
        onPressPrivacy={() => navigation.navigate('Privacidade')}
      />
    </View>
  );
}
