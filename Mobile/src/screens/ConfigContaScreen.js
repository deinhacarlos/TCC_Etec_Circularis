// src/screens/ConfigContaScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import styles from '../styles/ConfigContaStyles';
import { apiGetAuth, apiPutAuth } from '../Api';
import TermsFooter from '../components/TermsFooter';

export default function ConfigContaScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [escola, setEscola] = useState('');
  const [cidade, setCidade] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const carregarDados = async () => {
    try {
      const res = await apiGetAuth('/usuarios/me'); // ajuste se a rota for outra
      setNome(res?.Nome || res?.nome || '');
      setEmail(res?.Email || res?.email || '');
      setEscola(res?.Escola || res?.escola || '');
      setCidade(res?.Cidade || res?.cidade || '');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar seus dados.');
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', carregarDados);
    return unsub;
  }, [navigation]);

  const salvarPerfil = async () => {
    if (!nome || !email) {
      Alert.alert('Erro', 'Nome e e-mail são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await apiPutAuth('/usuarios/me', {
        Nome: nome,
        Email: email,
        Escola: escola,
        Cidade: cidade,
      });
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar seus dados.');
    } finally {
      setLoading(false);
    }
  };

  const alterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos de senha.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'A nova senha e a confirmação não conferem.');
      return;
    }

    setLoading(true);
    try {
      await apiPutAuth('/usuarios/alterar-senha', {
        senhaAtual,
        novaSenha,
      });
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Configurações da Conta</Text>
        <Text style={styles.subtitle}>
          Atualize seus dados pessoais e senha de acesso.
        </Text>

        <Text style={styles.sectionTitle}>Dados pessoais</Text>

        <Text style={styles.label}>Nome completo *</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>E-mail *</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Escola</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={escola}
          onChangeText={setEscola}
        />

        <Text style={styles.label}>Cidade</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={cidade}
          onChangeText={setCidade}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={salvarPerfil}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Salvando...' : 'Salvar dados'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Alterar senha</Text>

        <Text style={styles.label}>Senha atual</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={senhaAtual}
          onChangeText={setSenhaAtual}
          secureTextEntry
        />

        <Text style={styles.label}>Nova senha</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar nova senha</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.passwordButton}
          onPress={alterarSenha}
          disabled={loading}
        >
          <Text style={styles.passwordButtonText}>
            {loading ? 'Enviando...' : 'Alterar senha'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <TermsFooter
        onPressTerms={() => navigation.navigate('Termos')}
        onPressPrivacy={() => navigation.navigate('Privacidade')}
      />
    </View>
  );
}
