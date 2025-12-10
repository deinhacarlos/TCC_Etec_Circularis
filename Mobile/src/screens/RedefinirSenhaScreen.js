// src/screens/RedefinirSenhaScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/RedefinirSenhaStyles';
import { colors } from '../styles/colors'; // Certifique-se que o colors.js existe
import { apiPostPublic } from '../Api';

export default function RedefinirSenhaScreen({ route, navigation }) {
  // Tenta pegar o token vindo da navegação (ex: deep link)
  // Se não tiver token, idealmente deveria pedir para o usuário digitar ou voltar
  const { token } = route.params || {};

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Controle de visibilidade
  const [showNova, setShowNova] = useState(false);
  const [showConfirma, setShowConfirma] = useState(false);

  const handleRedefinir = async () => {
    if (!token) {
      Alert.alert('Erro', 'Token de recuperação inválido ou não encontrado.');
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert('Atenção', 'A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    try {
      setLoading(true);
      
      // Chamada para a API igual ao seu script web
      // Rota: /usuarios/redefinir-senha/:token
      await apiPostPublic(`/usuarios/redefinir-senha/${token}`, { novaSenha });

      Alert.alert(
        'Sucesso!',
        'Sua senha foi alterada. Faça login com a nova senha.',
        [{ text: 'Ir para Login', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) }]
      );

    } catch (error) {
      const msg = error.message || 'Erro ao redefinir senha.';
      Alert.alert('Erro', msg.includes('expirado') ? 'O link expirou. Solicite novamente.' : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            
            <View style={styles.logoContainer}>
               <Image source={require('../../assets/logo.png')} style={styles.logo} />
            </View>

            <Text style={styles.title}>Nova Senha</Text>
            <Text style={styles.subtitle}>
              Crie uma nova senha segura para sua conta.
            </Text>

            <View style={styles.formContainer}>
              
              {/* Nova Senha */}
              <Text style={styles.label}>Nova Senha</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  secureTextEntry={!showNova}
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                />
                <TouchableOpacity onPress={() => setShowNova(!showNova)} style={styles.iconButton}>
                  <Ionicons name={showNova ? "eye-off-outline" : "eye-outline"} size={22} color={colors.grayText} />
                </TouchableOpacity>
              </View>

              {/* Confirmar Senha */}
              <Text style={styles.label}>Confirmar Senha</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirma}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                />
                <TouchableOpacity onPress={() => setShowConfirma(!showConfirma)} style={styles.iconButton}>
                  <Ionicons name={showConfirma ? "eye-off-outline" : "eye-outline"} size={22} color={colors.grayText} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleRedefinir}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Alterar Senha</Text>
                )}
              </TouchableOpacity>

            </View>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.backText}>Cancelar e Voltar para Login</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}