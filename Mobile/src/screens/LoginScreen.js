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

  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

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

  const tratarMensagemDeErro = (msg) => {
    const msgLower = (msg || '').toLowerCase();

    if (
      msgLower.includes('usuário') ||
      msgLower.includes('user') ||
      msgLower.includes('found')
    ) {
      setErro('E-mail não encontrado. Verifique ou cadastre-se.');
    } else if (
      msgLower.includes('senha') ||
      msgLower.includes('password')
    ) {
      setErro('Senha incorreta. Tente novamente.');
    } else if (
      msgLower.includes('network') ||
      msgLower.includes('connect')
    ) {
      setErro('Não foi possível conectar ao servidor. Verifique sua internet.');
    } else {
      setErro(msg || 'Ocorreu um erro inesperado.');
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !senha) {
      setErro('Por favor, preencha o e-mail e a senha.');
      return;
    }

    try {
      setLoading(true);
      setErro('');

      const body = { Email: email.trim(), Senha: senha };

      const response = await apiPostPublic('/usuarios/login', body);

      if (response && response.token) {
        await saveToken(response.token);

        if (response.userId) {
          await saveUserId(response.userId);
        }

        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        const msgBackend =
          response?.erro || response?.error || response?.message || '';
        tratarMensagemDeErro(msgBackend);
      }
    } catch (e) {
      const msgErro = e.message || e.toString();
      tratarMensagemDeErro(msgErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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
          </Text>{' '}
          e{' '}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('Privacidade')}
          >
            Política de privacidade
          </Text>
          .
        </Text>

        {/* Campo e-mail */}
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor={colors.grayText}
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (erro) setErro('');
          }}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Campo senha */}
        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Digite sua senha"
            placeholderTextColor={colors.grayText}
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
              name={senhaVisivel ? 'eye-off' : 'eye'}
              size={20}
              color={colors.grayText}
            />
          </TouchableOpacity>
        </View>

        {/* Mensagem de erro */}
        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

        {/* Recuperar senha */}
        <View style={styles.forgotRow}>
          <Text style={styles.forgotText}>Esqueceu a sua senha?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('RecuperarSenha')}
          >
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
          <Text style={styles.signupText}>Não possui uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.signupLink}> Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
