// src/screens/RecuperarSenhaScreen.js
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
  Alert
} from 'react-native';
import styles from '../styles/RecuperarSenhaStyles';
import { apiPostPublic } from '../Api';

export default function RecuperarSenhaScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Configura o título do topo
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Recuperar Senha',
      headerTitleStyle: {
        fontFamily: 'Nunito-Bold',
        fontWeight: 'bold',
      },
      headerTintColor: '#000', // Cor da seta de voltar
    });
  }, [navigation]);

  const handleEnviar = async () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Por favor, digite seu e-mail cadastrado.');
      return;
    }

    try {
      setLoading(true);
      
      // Chama a rota do backend (confirme se a rota é essa no seu usuarioRoutes.js)
      // Geralmente espera { "Email": "..." } com E maiúsculo, igual ao Login
      await apiPostPublic('/usuarios/esqueci-senha', { Email: email.trim() });

      Alert.alert(
        'Sucesso!',
        'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha em instantes.',
        [{ text: 'Voltar para Login', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      // Mesmo se der erro (ex: email não existe), por segurança às vezes não avisamos
      // Mas para debug/desenvolvimento, mostramos o erro:
      const msg = error.message || 'Ocorreu um erro ao tentar enviar o e-mail.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Imagem Ilustrativa (Reutilizando a do Login ou outra) */}
          <View style={styles.bannerContainer}>
             <Image
              // Você pode usar a mesma imagem do login ou 'cadastroLogin.png'
              source={require('../../assets/bannerLogin.png')} 
              style={styles.banner}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Esqueceu a senha?</Text>
          <Text style={styles.subtitle}>
            Não se preocupe! Insira seu e-mail abaixo e enviaremos as instruções para você.
          </Text>

          <Text style={styles.label}>E-mail cadastrado</Text>
          <TextInput
            style={styles.input}
            placeholder="ex: maria.silva@etec.sp.gov.br"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleEnviar}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>Voltar para Login</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}