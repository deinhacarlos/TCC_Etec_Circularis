// src/screens/ChatScreen.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import styles from '../styles/ChatStyles';
import { apiGetAuth, apiPostAuth } from '../Api';
import TermsFooter from '../components/TermsFooter';

export default function ChatScreen({ navigation, route }) {
  // Id do outro usuário ou da conversa pode vir via route.params
  const conversaId = route?.params?.conversaId || null;

  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  const carregarMensagens = async () => {
    if (!conversaId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // ajuste para a rota real (ex: /chat/conversas/:id/mensagens)
      const res = await apiGetAuth(`/chat/conversas/${conversaId}/mensagens`);

      if (Array.isArray(res)) {
        setMensagens(res);
      } else if (Array.isArray(res?.mensagens)) {
        setMensagens(res.mensagens);
      } else {
        setMensagens([]);
      }

      // rola para a última mensagem
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as mensagens.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarMensagens);
    return unsubscribe;
  }, [navigation, conversaId]);

  const enviarMensagem = async () => {
    if (!texto.trim() || !conversaId) return;

    const conteudo = texto.trim();
    setTexto('');

    try {
      // ajuste conforme sua API (ex: /chat/mensagens)
      await apiPostAuth('/chat/mensagens', {
        idConversa: conversaId,
        conteudo,
      });

      await carregarMensagens();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar a mensagem.');
    }
  };

  const renderMensagem = ({ item }) => {
    const souEu = item.eDoUsuarioLogado || item.remetenteEhLogado;

    return (
      <View
        style={[
          styles.messageContainer,
          souEu ? styles.messageRight : styles.messageLeft,
        ]}
      >
        <View style={[styles.messageBubble, souEu ? styles.bubbleRight : styles.bubbleLeft]}>
          <Text style={styles.messageText}>{item.conteudo || item.Conteudo}</Text>
          {item.dataEnvio && (
            <Text style={styles.messageTime}>{item.dataEnvio}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref={flatListRef}
          data={mensagens}
          keyExtractor={(item) => String(item.id || item.Id_Mensagem)}
          renderItem={renderMensagem}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToEnd({ animated: true });
            }
          }}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            value={texto}
            onChangeText={setTexto}
          />
          <TouchableOpacity style={styles.sendButton} onPress={enviarMensagem}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <TermsFooter
        onPressTerms={() => navigation.navigate('Termos')}
        onPressPrivacy={() => navigation.navigate('Privacidade')}
      />
    </View>
  );
}
