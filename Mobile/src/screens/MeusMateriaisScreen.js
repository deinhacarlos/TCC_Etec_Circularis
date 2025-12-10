// src/screens/MeusMateriaisScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import styles from '../styles/MeusMateriaisStyles';
import { apiGetAuth } from '../Api';
import TermsFooter from '../components/TermsFooter';

export default function MeusMateriaisScreen({ navigation }) {
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarMateriais = async () => {
    try {
      setLoading(true);

      // equivalente à lógica do meusmateriais-script.js (buscar do usuário logado)
      const res = await apiGetAuth('/materiais/meus'); // ajuste se seu backend usar outra rota

      if (Array.isArray(res)) {
        setMateriais(res);
      } else if (Array.isArray(res?.materiais)) {
        setMateriais(res.materiais);
      } else {
        setMateriais([]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar seus materiais.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarMateriais);
    return unsubscribe;
  }, [navigation]);

  const handleIrCadastroMaterial = () => {
    navigation.navigate('CadastroMaterial');
  };

  const handleIrTrocas = () => {
    navigation.navigate('Trocas');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner / imagem topo */}
        <Image
          source={require('../../assets/bannerBusca.png')}
          style={styles.banner}
          resizeMode="cover"
        />

        <Text style={styles.title}>Meus Materiais</Text>
        <Text style={styles.subtitle}>
          Veja todos os materiais cadastrados na Circularis.
        </Text>

        {/* Botão para cadastrar novo material */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleIrCadastroMaterial}
        >
          <Text style={styles.primaryButtonText}>Cadastrar novo material</Text>
        </TouchableOpacity>

        {/* Botão para ir às trocas */}
        <TouchableOpacity style={styles.secondaryButton} onPress={handleIrTrocas}>
          <Text style={styles.secondaryButtonText}>Ver minhas trocas</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" color="#00A86B" />
        ) : materiais.length === 0 ? (
          <Text style={styles.emptyText}>
            Você ainda não cadastrou nenhum material.
          </Text>
        ) : (
          materiais.map((mat) => (
            <View key={mat.id || mat.IDMaterial} style={styles.card}>
              {/* Imagem do material, se houver URL */}
              {mat.imagemUrl || mat.Imagem ? (
                <Image
                  source={{ uri: mat.imagemUrl || mat.Imagem }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.cardImagePlaceholder}>
                  <Text style={styles.cardImagePlaceholderText}>Sem imagem</Text>
                </View>
              )}

              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{mat.titulo || mat.Titulo}</Text>
                <Text style={styles.cardCategory}>
                  {mat.categoria || mat.Categoria}
                </Text>
                <Text style={styles.cardDetails}>
                  Estado: {mat.estadoConservacao || mat.EstadoConservacao}
                </Text>
                <Text style={styles.cardDetails}>
                  Tipo: {mat.tipo || mat.Tipo}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TermsFooter
        onPressTerms={() => navigation.navigate('Termos')}
        onPressPrivacy={() => navigation.navigate('Privacidade')}
      />
    </View>
  );
}
