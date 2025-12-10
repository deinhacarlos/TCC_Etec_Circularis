// src/screens/LoginScreen.js
import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/LoginStyles';
import { colors } from '../styles/colors';
import { apiPostPublic, saveToken, saveUserId } from '../Api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  // Estado para mensagem de erro customizada
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  // Configuração do Header (Título "Login" em negrito no topo)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Login',
      headerTitleStyle: {
        fontFamily: 'Nunito-Bold',
        fontWeight: 'bold',
        fontSize: 18,
      },
    });
  }, [navigation]);

  const handleLogin = async () => {
    // 1. Validação local básica
    if (!email.trim() || !senha) {
      setErro('Por favor, preencha o e-mail e a senha.');
      return;
    }

    try {
      setLoading(true);
      setErro(''); // Limpa erro anterior ao tentar novamente

      const body = { Email: email.trim(), Senha: senha };
      // Chama a API
      const response = await apiPostPublic('/usuarios/login', body);

      if (response.token) {
        // Salva token e ID
        await saveToken(response.token);
        if (response.userId) {
          await saveUserId(response.userId);
        }

        // --- CORREÇÃO IMPORTANTE ---
        // Reseta a pilha e manda para MainTabs (onde está o menu nativo)
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });

      } else {
        // Erro lógico (ex: backend retornou json com erro mas status 200)
        const msgBackend = response.erro || response.error || response.message || '';
        tratarMensagemDeErro(msgBackend);
      }
    } catch (e) {
      // 2. Erro de requisição (ex: status 400, 401, 404, 500)
      const msgErro = e.message || e.toString();
      tratarMensagemDeErro(msgErro);
    } finally {
      setLoading(false);
    }
  };

  // Função para "traduzir" o erro técnico para algo amigável
  const tratarMensagemDeErro = (msg) => {
    const msgLower = msg.toLowerCase();

    if (msgLower.includes('usuário') || msgLower.includes('user') || msgLower.includes('found')) {
      setErro('E-mail não encontrado. Verifique ou cadastre-se.');
    } else if (msgLower.includes('senha') || msgLower.includes('password')) {
      setErro('Senha incorreta. Tente novamente.');
    } else if (msgLower.includes('network') || msgLower.includes('connect')) {
      setErro('Não foi possível conectar ao servidor. Verifique sua internet.');
    } else {
      setErro(msg || 'Ocorreu um erro inesperado.');
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Banner topo */}
          <Image
            source={require('../../assets/bannerLogin.png')}
            style={styles.banner}
            resizeMode="cover"
          />

          {/* Subtítulo com Termos */}
          <Text style={styles.subtitle}>
            Ao fazer login, você concorda com os{' '}
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate('Termos')}
            >
              Termos
            </Text> e{' '}
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate('Privacidade')}
            >
              Política de privacidade
            </Text>.
          </Text>

          {/* Campo e-mail */}
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (erro) setErro('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Campo Senha */}
          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Sua senha"
              placeholderTextColor="#999"
              value={senha}
              onChangeText={(t) => {
                setSenha(t);
                if (erro) setErro('');
              }}
              secureTextEntry={!senhaVisivel}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setSenhaVisivel(!senhaVisivel)}
            >
              <Ionicons
                name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={colors.grayText}
              />
            </TouchableOpacity>
          </View>

          {/* MENSAGEM DE ERRO */}
          {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

          {/* Recuperar senha */}
          <View style={styles.forgotRow}>
            <Text style={styles.forgotText}>Esqueceu a sua senha?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RecuperarSenha')}>
              {/* ^^^ Garanta que o nome aqui é 'RecuperarSenha' */}
              <Text style={styles.forgotLink}>Recuperar agora</Text>
            </TouchableOpacity>
          </View>

          {/* Botão Login */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Entrando...' : 'Login'}
            </Text>
          </TouchableOpacity>

          {/* Cadastro */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Não possui uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
              <Text style={styles.signupLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}