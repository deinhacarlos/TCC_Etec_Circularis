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
import { apiGetAuth, getUserId, API_URL } from '../Api';
import TermsFooter from '../components/TermsFooter';

export default function MeusMateriaisScreen({ navigation }) {
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarMateriais = async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      
      if (!userId) {
        throw new Error('Usuário não identificado');
      }

      // CORREÇÃO: Usando a mesma rota do Web (Query Param)
      const res = await apiGetAuth(`/materiais?usuarioid=${userId}`);

      if (Array.isArray(res)) {
        setMateriais(res);
      } else if (Array.isArray(res?.materiais)) {
        setMateriais(res.materiais);
      } else {
        setMateriais([]);
      }
    } catch (error) {
      console.log(error);
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
          materiais.map((mat) => {
            // Ajuste para pegar a URL da imagem corretamente
            const imgPath = mat.Imagem || mat.imagemUrl;
            const fullImgUrl = imgPath ? `${API_URL}/uploads/${imgPath}` : null;

            return (
              <View key={mat.Id_Material || mat.id} style={styles.card}>
                {/* Imagem do material */}
                {fullImgUrl ? (
                  <Image
                    source={{ uri: fullImgUrl }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.cardImagePlaceholder}>
                    <Text style={styles.cardImagePlaceholderText}>Sem imagem</Text>
                  </View>
                )}

                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{mat.Titulo || mat.titulo}</Text>
                  <Text style={styles.cardCategory}>
                    {mat.Categoria || mat.categoria || 'Sem categoria'}
                  </Text>
                  <Text style={styles.cardDetails}>
                    Estado: {mat.EstadoConservacao || mat.estadoConservacao}
                  </Text>
                  <Text style={styles.cardDetails}>
                    Tipo: {mat.TipoMaterial || mat.Tipo || mat.tipo}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <TermsFooter
        onPressTerms={() => navigation.navigate('Termos')}
        onPressPrivacy={() => navigation.navigate('Privacidade')}
      />
    </View>
  );
}