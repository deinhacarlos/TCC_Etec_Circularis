// src/screens/PerfilScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import styles from '../styles/PerfilStyles';
import { API_URL, apiGet, getUserId, clearAuth } from '../Api';
import TermsFooter from '../components/TermsFooter';

export default function PerfilScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      if (!userId) {
        throw new Error('Sem usuário logado');
      }
      const res = await apiGet(`/usuarios/${userId}`);
      setUsuario(res || null);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar seus dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarPerfil);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    await clearAuth();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const nome = usuario?.Nome_Completo || usuario?.Nome || 'Usuário';
  const email = usuario?.Email || '';
  const endereco = usuario?.Endereco || '';
  const foto = usuario?.FotoPerfil;
  const avatarUrl = foto ? `${API_URL}/uploads/${foto}` : null;
  const inicial = nome.charAt(0).toUpperCase();

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{inicial}</Text>
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{nome}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>

          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('ConfigConta')}
          >
            <Text style={styles.rowText}>Configurações da conta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('Notificacoes')}
          >
            <Text style={styles.rowText}>Notificações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('Trocas')}
          >
            <Text style={styles.rowText}>Minhas trocas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <Text style={styles.rowText}>
            {endereco || 'Endereço não informado'}
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      <TermsFooter
        onPressTerms={() => navigation.navigate('Termos')}
        onPressPrivacy={() => navigation.navigate('Privacidade')}
      />
    </View>
  );
}
