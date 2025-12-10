// src/screens/NotificacoesScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/NotificacoesStyles';
import { apiGetAuth, apiPostAuth } from '../Api';
import TermsFooter from '../components/TermsFooter';

export default function NotificacoesScreen({ navigation }) {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarNotificacoes = async () => {
    try {
      setLoading(true);
      // ajuste para a rota real, similar ao notificacoes-script.js
      const res = await apiGetAuth('/notificacoes/minhas');

      if (Array.isArray(res)) {
        setNotificacoes(res);
      } else if (Array.isArray(res?.notificacoes)) {
        setNotificacoes(res.notificacoes);
      } else {
        setNotificacoes([]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as notificações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarNotificacoes);
    return unsubscribe;
  }, [navigation]);

  const marcarTodasComoLidas = async () => {
    try {
      await apiPostAuth('/notificacoes/marcar-todas-lidas', {});
      carregarNotificacoes();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível marcar as notificações como lidas.');
    }
  };

  const temNaoLidas = notificacoes.some((n) => !n.Lida && !n.lida);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Notificações</Text>

          {temNaoLidas && (
            <TouchableOpacity onPress={marcarTodasComoLidas}>
              <Text style={styles.markAll}>Marcar todas como lidas</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#00A86B" />
            <Text style={styles.helperText}>Carregando notificações...</Text>
          </View>
        )}

        {!loading && notificacoes.length === 0 && (
          <View style={styles.center}>
            <Text style={styles.helperTitle}>Nenhuma notificação.</Text>
            <Text style={styles.helperText}>
              Quando houver novidades sobre suas trocas, elas aparecerão aqui.
            </Text>
          </View>
        )}

        {!loading &&
          notificacoes.map((n) => {
            const lida = n.Lida || n.lida;
            const tipo = n.Tipo || n.tipo;
            const mensagem = n.Mensagem || n.mensagem;
            const data = n.DataCriacao || n.dataCriacao || n.data;

            return (
              <View
                key={n.Id_Notificacao || n.id}
                style={[styles.card, lida ? styles.cardRead : styles.cardUnread]}
              >
                <Text style={styles.cardType}>{tipo || 'Notificação'}</Text>
                <Text style={styles.cardMessage}>{mensagem}</Text>
                {data && <Text style={styles.cardDate}>{data}</Text>}
              </View>
            );
          })}
      </ScrollView>

      <TermsFooter
        onPressTerms={() => navigation.navigate('Termos')}
        onPressPrivacy={() => navigation.navigate('Privacidade')}
      />
    </View>
  );
}
