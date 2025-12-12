// src/screens/ChatScreen.js

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import { apiGet, apiPost, getUserId, API_URL } from '../Api';
import { colors } from '../styles/colors';
import chatStyles from '../styles/ChatStyles';

export default function ChatScreen({ route, navigation }) {
  const [conversas, setConversas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myId, setMyId] = useState(null);

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const flatListRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      carregarConversas();
    }, [])
  );

  useEffect(() => {
    if (route?.params?.targetUserId) {
      iniciarNovaConversa(route.params);
      navigation.setParams({
        targetUserId: null,
        targetUserName: null,
        materialTitulo: null,
      });
    }
  }, [route?.params, navigation]);

  const carregarConversas = async () => {
    setLoading(true);
    try {
      const id = await getUserId();
      setMyId(id);

      const res = await apiGet(`/chats?usuario_id=${id}`);
      setConversas(Array.isArray(res) ? res : []);
    } catch (error) {
      console.log('Erro ao carregar chats', error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarNovaConversa = async (params) => {
    const { targetUserId, targetUserName, materialTitulo } = params;

    const mensagemSugestao = `Olá, ${targetUserName}, tenho interesse no seu material "${materialTitulo}". Podemos combinar a Troca ou Doação?`;

    const chatExistente = conversas.find(
      (c) =>
        String(c.Id_Usuario1_FK) === String(targetUserId) ||
        String(c.Id_Usuario2_FK) === String(targetUserId)
    );

    const dadosChat = {
      Id_Chat: chatExistente ? chatExistente.Id_Chat : null,
      novo: !chatExistente,
      OtherId: targetUserId,
      Nome_Exibicao: targetUserName,
    };

    setActiveChat(dadosChat);
    setMessages([]);
    setInputText(mensagemSugestao);
  };

  const abrirConversa = (chat) => {
    const isUser1 = String(chat.Id_Usuario1_FK) === String(myId);
    const otherName = isUser1 ? chat.Nome_Usuario2 : chat.Nome_Usuario1;
    const otherPhoto = isUser1 ? chat.Foto_Usuario2 : chat.Foto_Usuario1;

    setActiveChat({
      ...chat,
      Nome_Exibicao: otherName,
      Foto_Exibicao: otherPhoto,
      novo: false,
    });

    carregarMensagens(chat.Id_Chat);
  };

  const carregarMensagens = async (chatId) => {
    if (!chatId) return;
    try {
      const msgs = await apiGet(`/mensagens?chat_id=${chatId}`);
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch (e) {
      console.log('Erro ao carregar mensagens', e);
    }
  };

  const enviarMensagem = async () => {
    if (!inputText.trim() || !activeChat) return;

    const textoParaEnviar = inputText;
    setInputText('');

    try {
      let chatId = activeChat.Id_Chat;

      if (!chatId || activeChat.novo) {
        const resChat = await apiPost('/chats', {
          Id_Usuario1_FK: myId,
          Id_Usuario2_FK: activeChat.OtherId,
        });

        chatId = resChat.id || resChat.Id_Chat;
        setActiveChat((prev) => ({
          ...prev,
          Id_Chat: chatId,
          novo: false,
        }));
      }

      await apiPost('/mensagens', {
        Id_Chat_FK: chatId,
        Id_Usuario_Remetente_FK: myId,
        Conteudo: textoParaEnviar,
      });

      carregarMensagens(chatId);
      carregarConversas();
    } catch (e) {
      console.error('Erro ao enviar mensagem', e);
      setInputText(textoParaEnviar);
    }
  };

  // --- CONVERSA ABERTA ---
  if (activeChat) {
    const fotoUrl = activeChat.Foto_Exibicao
      ? `${API_URL}/uploads/${activeChat.Foto_Exibicao}`
      : null;

    return (
      <KeyboardAvoidingView
        style={chatStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0',
            backgroundColor: '#FFFFFF',
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveChat(null)}
            style={{ padding: 4, marginRight: 8 }}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.primaryPurple}
            />
          </TouchableOpacity>

          {fotoUrl ? (
            <Image
              source={{ uri: fotoUrl }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                marginRight: 10,
              }}
            />
          ) : (
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                marginRight: 10,
                backgroundColor: colors.primaryPurple,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
          )}

          <Text
            style={{
              fontFamily: 'Nunito-Bold',
              fontSize: 16,
              color: colors.darkText,
            }}
          >
            {activeChat.Nome_Exibicao || 'Usuário'}
          </Text>
        </View>

        {/* Mensagens */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) =>
            String(item.Id_Mensagem || index)
          }
          contentContainerStyle={chatStyles.messagesList}
          renderItem={({ item }) => {
            const isMe =
              String(item.Id_Usuario_Remetente_FK) === String(myId);
            const hora = item.DataEnvio
              ? new Date(item.DataEnvio).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            return (
              <View
                style={[
                  chatStyles.messageContainer,
                  isMe
                    ? { justifyContent: 'flex-end' }
                    : { justifyContent: 'flex-start' },
                ]}
              >
                <View
                  style={[
                    chatStyles.messageBubble,
                    isMe
                      ? chatStyles.bubbleRight
                      : chatStyles.bubbleLeft,
                  ]}
                >
                  <Text style={chatStyles.messageText}>
                    {item.Conteudo}
                  </Text>
                  <Text style={chatStyles.messageTime}>{hora}</Text>
                </View>
              </View>
            );
          }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          ListEmptyComponent={
            <View style={{ padding: 16 }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.grayText,
                  fontFamily: 'Nunito-Regular',
                  fontSize: 13,
                }}
              >
                Iniciando negociação sobre o livro. Envie a mensagem
                abaixo para começar.
              </Text>
            </View>
          }
        />

        {/* Input */}
        <View style={chatStyles.inputBar}>
          <TextInput
            style={chatStyles.input}
            placeholder="Digite uma mensagem..."
            placeholderTextColor="#777777"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity
            style={chatStyles.sendButton}
            onPress={enviarMensagem}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // --- LISTA DE CONVERSAS ---
  return (
    <View style={chatStyles.container}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#E0E0E0',
        }}
      >
        <Text
          style={{
            fontFamily: 'Nunito-Bold',
            fontSize: 18,
            color: colors.darkText,
          }}
        >
          Mensagens
        </Text>
      </View>

      {loading ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator
            size="large"
            color={colors.primaryPurple}
          />
        </View>
      ) : (
        <FlatList
          data={conversas}
          keyExtractor={(item) => String(item.Id_Chat)}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const isUser1 =
              String(item.Id_Usuario1_FK) === String(myId);
            const nome = isUser1
              ? item.Nome_Usuario2
              : item.Nome_Usuario1;
            const foto = isUser1
              ? item.Foto_Usuario2
              : item.Foto_Usuario1;
            const fotoUrl = foto
              ? `${API_URL}/uploads/${foto}`
              : null;

            return (
              <TouchableOpacity
                onPress={() => abrirConversa(item)}
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F0F0F0',
                  alignItems: 'center',
                }}
              >
                {fotoUrl ? (
                  <Image
                    source={{ uri: fotoUrl }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      marginRight: 12,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      marginRight: 12,
                      backgroundColor: colors.primaryPurple,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons
                      name="person"
                      size={22}
                      color="#FFFFFF"
                    />
                  </View>
                )}

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'Nunito-Bold',
                      fontSize: 15,
                      color: colors.darkText,
                    }}
                  >
                    {nome}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Nunito-Regular',
                      fontSize: 12,
                      color: colors.grayText,
                      marginTop: 2,
                    }}
                  >
                    Toque para ver a conversa
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={{ padding: 16 }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.grayText,
                  fontFamily: 'Nunito-Regular',
                  fontSize: 13,
                }}
              >
                Nenhuma conversa ainda.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
