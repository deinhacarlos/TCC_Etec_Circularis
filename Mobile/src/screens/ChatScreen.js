import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, Text, FlatList, TextInput, TouchableOpacity, Image, 
  KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { apiGet, apiPost, getUserId, API_URL } from '../Api';
import { colors } from '../styles/colors';

export default function ChatScreen({ route, navigation }) {
  const [conversas, setConversas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myId, setMyId] = useState(null);

  // Estados da Conversa Ativa
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  
  const flatListRef = useRef(null);

  // 1. Carrega lista de conversas ao entrar
  useFocusEffect(useCallback(() => {
    carregarConversas();
  }, []));

  // 2. Verifica se veio da Busca (Propor Troca)
  useEffect(() => {
    if (route.params?.targetUserId) {
        iniciarNovaConversa(route.params);
        // Limpa params para não re-executar
        navigation.setParams({ targetUserId: null, materialTitulo: null });
    }
  }, [route.params]);

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

  // --- LÓGICA DA PROPOSTA DE TROCA ---
  const iniciarNovaConversa = async (params) => {
    const { targetUserId, targetUserName, materialTitulo } = params;
    
    // Frase completa correta
    const mensagemSugestao = `Olá, ${targetUserName}, tenho interesse no seu material "${materialTitulo}". Podemos combinar a Troca ou Doação?`;

    // Verifica se já existe chat
    const chatExistente = conversas.find(c => 
        String(c.Id_Usuario1_FK) === String(targetUserId) || 
        String(c.Id_Usuario2_FK) === String(targetUserId)
    );

    // TRUQUE: Mesmo se existir chat, vamos abrir "limpo" visualmente 
    // para focar na nova negociação.
    
    const dadosChat = {
        Id_Chat: chatExistente ? chatExistente.Id_Chat : null, // Se existir, usa o ID
        novo: !chatExistente, // Se não existir, marca como novo
        OtherId: targetUserId,
        Nome_Exibicao: targetUserName,
        // Foto se tiver...
    };

    setActiveChat(dadosChat);
    
    // IMPORTANTE: Não carregamos as mensagens antigas aqui (setMessages([]))
    // para dar a sensação de "Nova Negociação" sobre este livro específico.
    setMessages([]); 
    
    // Preenche o input com a sugestão
    setInputText(mensagemSugestao);
  };

  // Abrir conversa normal (pela lista) - Aqui carrega histórico
  const abrirConversa = (chat) => {
      const isUser1 = String(chat.Id_Usuario1_FK) === String(myId);
      const otherName = isUser1 ? chat.Nome_Usuario2 : chat.Nome_Usuario1;
      const otherPhoto = isUser1 ? chat.Foto_Usuario2 : chat.Foto_Usuario1;
      
      setActiveChat({ 
          ...chat, 
          Nome_Exibicao: otherName,
          Foto_Exibicao: otherPhoto,
          novo: false
      });
      carregarMensagens(chat.Id_Chat); // Aqui carrega o histórico
  };

  const carregarMensagens = async (chatId) => {
      if (!chatId) return;
      try {
          const msgs = await apiGet(`/mensagens?chat_id=${chatId}`);
          setMessages(Array.isArray(msgs) ? msgs : []);
      } catch (e) { console.log(e); }
  };

  const enviarMensagem = async () => {
      if (!inputText.trim()) return;
      
      const textoParaEnviar = inputText; 
      setInputText(''); 
      
      try {
          let chatId = activeChat.Id_Chat;

          // Se for chat novo ou se estamos na tela "limpa" de proposta e o chat ainda não existia
          if (!chatId || activeChat.novo) {
              const resChat = await apiPost('/chats', {
                  Id_Usuario1_FK: myId,
                  Id_Usuario2_FK: activeChat.OtherId
              });
              chatId = resChat.id || resChat.Id_Chat;
              
              // Atualiza o estado
              setActiveChat(prev => ({ ...prev, Id_Chat: chatId, novo: false }));
          }

          // Envia a mensagem
          await apiPost('/mensagens', {
              Id_Chat_FK: chatId,
              Id_Usuario_Remetente_FK: myId,
              Conteudo: textoParaEnviar
          });

          // Agora sim carrega o histórico (incluindo a nova mensagem)
          carregarMensagens(chatId);
          carregarConversas(); 

      } catch (e) {
          console.error("Erro ao enviar", e);
          setInputText(textoParaEnviar);
      }
  };

  // --- RENDERIZAÇÃO: CONVERSA ABERTA ---
  if (activeChat) {
      const fotoUrl = activeChat.Foto_Exibicao ? `${API_URL}/uploads/${activeChat.Foto_Exibicao}` : null;

      return (
          <View style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
              {/* Header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff', elevation: 2, paddingTop: Platform.OS === 'ios' ? 50 : 15 }}>
                  <TouchableOpacity onPress={() => setActiveChat(null)} style={{ padding: 5 }}>
                      <Ionicons name="arrow-back" size={24} color="#333" />
                  </TouchableOpacity>
                  
                  <Image 
                    source={fotoUrl ? { uri: fotoUrl } : require('../../assets/logo.png')} 
                    style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 10, backgroundColor: '#ddd' }} 
                  />
                  
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: colors.darkText }}>
                      {activeChat.Nome_Exibicao || 'Usuário'}
                  </Text>
              </View>

              {/* Lista de Mensagens */}
              <FlatList
                  ref={flatListRef}
                  data={messages}
                  keyExtractor={(item, index) => String(item.Id_Mensagem || index)}
                  onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                  onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                  ListEmptyComponent={
                      // Se não tiver mensagens (caso da proposta), mostra um aviso amigável
                      <View style={{ padding: 20, alignItems: 'center', marginTop: 50 }}>
                          <Text style={{ color: '#999', textAlign: 'center' }}>
                              Iniciando negociação sobre o livro. Envie a mensagem abaixo para começar.
                          </Text>
                      </View>
                  }
                  renderItem={({ item }) => {
                      const isMe = String(item.Id_Usuario_Remetente_FK) === String(myId);
                      return (
                          <View style={{ 
                              alignSelf: isMe ? 'flex-end' : 'flex-start',
                              backgroundColor: isMe ? colors.primaryPurple : '#fff',
                              padding: 12, 
                              marginVertical: 5, 
                              marginHorizontal: 10,
                              borderRadius: 12,
                              borderBottomRightRadius: isMe ? 0 : 12,
                              borderBottomLeftRadius: isMe ? 12 : 0,
                              maxWidth: '75%',
                              elevation: 1
                          }}>
                              <Text style={{ color: isMe ? '#fff' : '#333', fontSize: 15 }}>{item.Conteudo}</Text>
                              <Text style={{ color: isMe ? 'rgba(255,255,255,0.7)' : '#999', fontSize: 10, alignSelf: 'flex-end', marginTop: 4 }}>
                                {new Date(item.DataEnvio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </Text>
                          </View>
                      );
                  }}
                  contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
              />

              {/* Input de Texto CORRIGIDO */}
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
                  <View style={{ flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center' }}>
                      <TextInput 
                          style={{ 
                              flex: 1, 
                              backgroundColor: '#f0f0f0', 
                              borderRadius: 20, 
                              paddingHorizontal: 15, 
                              paddingTop: 10, // Importante para multiline
                              paddingBottom: 10,
                              minHeight: 50,
                              maxHeight: 100, // Limita altura se texto for grande
                              color: '#000',
                              textAlignVertical: 'center' // Alinha texto no centro se for uma linha
                          }}
                          placeholder="Digite sua mensagem..."
                          placeholderTextColor="#999"
                          value={inputText} 
                          onChangeText={setInputText}
                          multiline={true} // Permite várias linhas
                      />
                      <TouchableOpacity onPress={enviarMensagem} style={{ marginLeft: 10, padding: 12, backgroundColor: colors.primaryPurple, borderRadius: 25 }}>
                          <Ionicons name="send" size={20} color="#fff" />
                      </TouchableOpacity>
                  </View>
              </KeyboardAvoidingView>
          </View>
      );
  }

  // --- RENDERIZAÇÃO: LISTA DE CONVERSAS (Igual) ---
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 20, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.darkText, fontFamily: 'Caprasimo-Regular' }}>Mensagens</Text>
      </View>
      
      {loading ? (
          <ActivityIndicator size="large" color={colors.primaryPurple} style={{marginTop: 50}}/>
      ) : (
          <FlatList
            data={conversas}
            keyExtractor={(item) => String(item.Id_Chat)}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item }) => {
                const isUser1 = String(item.Id_Usuario1_FK) === String(myId);
                const nome = isUser1 ? item.Nome_Usuario2 : item.Nome_Usuario1;
                const foto = isUser1 ? item.Foto_Usuario2 : item.Foto_Usuario1;
                const fotoUrl = foto ? `${API_URL}/uploads/${foto}` : null;

                return (
                    <TouchableOpacity onPress={() => abrirConversa(item)} style={{ flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderColor: '#f0f0f0', alignItems: 'center' }}>
                        {fotoUrl ? (
                            <Image source={{ uri: fotoUrl }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                        ) : (
                            <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: colors.lightGray, alignItems:'center', justifyContent:'center' }}>
                                <Ionicons name="person" size={24} color={colors.grayText} />
                            </View>
                        )}
                        <View style={{ marginLeft: 15, flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.darkText }}>{nome}</Text>
                            <Text style={{ color: colors.grayText, fontSize: 14 }} numberOfLines={1}>Toque para ver a conversa</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                );
            }}
            ListEmptyComponent={
                <View style={{ alignItems: 'center', marginTop: 100 }}>
                    <Ionicons name="chatbubbles-outline" size={60} color="#ddd" />
                    <Text style={{ textAlign: 'center', marginTop: 10, color: '#999', fontSize: 16 }}>Nenhuma conversa ainda.</Text>
                </View>
            }
          />
      )}
    </View>
  );
}