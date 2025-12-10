// src/screens/BuscaScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native'; // Removi useRoute que não precisa mais
import styles from '../styles/BuscaStyles';
import { colors } from '../styles/colors';
import { apiGet, API_URL, getUserId } from '../Api';
import CustomAlert from '../components/CustomAlert';

const ESTADOS = [
  { label: 'Todos', value: '' },
  { label: 'SP - São Paulo', value: 'SP' },
  { label: 'RJ - Rio de Janeiro', value: 'RJ' },
  { label: 'MG - Minas Gerais', value: 'MG' },
  { label: 'ES - Espírito Santo', value: 'ES' },
  { label: 'RS - Rio Grande do Sul', value: 'RS' },
  { label: 'BA - Bahia', value: 'BA' },
  { label: 'DF - Distrito Federal', value: 'DF' },
];

export default function BuscaScreen({ navigation }) {
  const [materiais, setMateriais] = useState([]);
  const [materiaisFiltrados, setMateriaisFiltrados] = useState([]);
  const [busca, setBusca] = useState('');
  const [estado, setEstado] = useState('');
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [notificacoesCount, setNotificacoesCount] = useState(0);
  
  // Alerta
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('info');

  const showAlert = (title, msg, type = 'info') => {
    setAlertTitle(title);
    setAlertMsg(msg);
    setAlertType(type);
    setAlertVisible(true);
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      if (userId) {
        const userRes = await apiGet(`/usuarios/${userId}`);
        setUsuario(userRes || null);
        const notifRes = await apiGet(`/notificacoes?usuario_id=${userId}`);
        if (Array.isArray(notifRes)) {
          const naoLidas = notifRes.filter(n => !n.Lida && !n.lida).length;
          setNotificacoesCount(naoLidas);
        }
      }
      const matRes = await apiGet('/materiais?disponibilidade=true');
      let lista = Array.isArray(matRes) ? matRes : (matRes?.materiais || []);
      setMateriais(lista);
      filtrarMateriais(lista, busca, estado);
    } catch (error) { console.log(error); } finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { carregarDados(); }, []));

  const filtrarMateriais = (listaOriginal, termoBusca, ufSelecionada) => {
    if (!listaOriginal) return;
    const termo = termoBusca.toLowerCase().trim();
    const uf = ufSelecionada;
    const filtrados = listaOriginal.filter(item => {
      const titulo = (item.Titulo || item.titulo || '').toLowerCase();
      const autor = (item.Autor || item.autor || '').toLowerCase();
      const localizacao = (item.Localizacao || item.localizacao || item.Estado || '').toUpperCase();
      const status = (item.Status || item.status || '');
      if (status === 'Concluido') return false;
      const matchTexto = titulo.includes(termo) || autor.includes(termo);
      const matchLocal = uf === '' || localizacao.includes(uf);
      return matchTexto && matchLocal;
    });
    setMateriaisFiltrados(filtrados);
  };

  useEffect(() => { filtrarMateriais(materiais, busca, estado); }, [busca, estado, materiais]);

  const handleProporTroca = (item) => {
    navigation.navigate('Trocas', { materialId: item.Id_Material || item.id });
  };

  const usuarioLogadoId = usuario?.Id_Usuario || usuario?.id;
  const avatarUrl = usuario?.FotoPerfil ? `${API_URL}/uploads/${usuario.FotoPerfil}` : null;
  const inicial = (usuario?.Nome_Completo || 'U').charAt(0).toUpperCase();

  const renderItem = ({ item }) => {
    const imageUrl = item.Imagem ? `${API_URL}/uploads/${item.Imagem}` : null;
    const donoId = item.Id_Usuario || item.Id_Usuario_FK || item.id_usuario;
    const isOwner = String(donoId) === String(usuarioLogadoId);

    return (
      <View style={styles.card}>
        <Image source={imageUrl ? { uri: imageUrl } : require('../../assets/logo.png')} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.Titulo}</Text>
          <Text style={styles.cardAuthor}>{item.Autor || 'Autor desconhecido'}</Text>
          <View style={styles.tagContainer}>
            <Ionicons name="book-outline" size={14} color={colors.grayText} />
            <Text style={styles.cardTagText}>{item.EstadoConservacao || 'Usado'}</Text>
          </View>
          {isOwner ? (
             <TouchableOpacity style={[styles.actionButton, styles.disabledButton]} disabled>
                <Ionicons name="person" size={16} color={colors.grayText} style={{marginRight:5}} />
                <Text style={[styles.actionButtonText, { color: colors.grayText }]}>Seu Material</Text>
             </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.actionButton} onPress={() => handleProporTroca(item)}>
              <Ionicons name="swap-horizontal" size={18} color={colors.white} style={{marginRight: 5}}/>
              <Text style={styles.actionButtonText}>Propor troca</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
           <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
           <Text style={styles.logoText}>circularis</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notificacoes')}>
            <Ionicons name="notifications-outline" size={24} color={colors.darkText} />
            {notificacoesCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{notificacoesCount}</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
            {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatarImage} /> : <View style={styles.avatarCircle}><Text style={styles.avatarInitial}>{inicial}</Text></View>}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        <FlatList
          data={materiaisFiltrados}
          keyExtractor={(item, index) => String(item.Id_Material || item.id || index)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          
          ListHeaderComponent={
            <>
              {/* BUSCA, BANNER, FILTROS */}
              <View style={styles.searchContainer}>
                 <Ionicons name="search-outline" size={20} color={colors.grayText} />
                 <TextInput style={styles.searchInput} placeholder="Buscar..." placeholderTextColor={colors.grayText} value={busca} onChangeText={setBusca} />
              </View>
              <View style={styles.bannerContainer}>
                <Image source={require('../../assets/bannerBusca.png')} style={styles.banner} resizeMode="cover" />
              </View>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Filtrar por Estado:</Text>
                <TouchableOpacity style={styles.filterButton} onPress={() => setDropdownAberto(!dropdownAberto)}>
                  <Text style={styles.filterButtonText}>{ESTADOS.find(e => e.value === estado)?.label || 'Todos'}</Text>
                  <Ionicons name="chevron-down" size={16} color={colors.darkText} />
                </TouchableOpacity>
              </View>
              {dropdownAberto && (
                <View style={styles.dropdownList}>
                  {ESTADOS.map((e) => (
                    <TouchableOpacity key={e.value} style={styles.dropdownItem} onPress={() => { setEstado(e.value); setDropdownAberto(false); }}>
                      <Text style={styles.dropdownText}>{e.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {loading && <ActivityIndicator size="large" color={colors.primaryPurple} style={{marginTop: 20}} />}
              {!loading && materiaisFiltrados.length === 0 && <View style={styles.emptyState}><Text style={styles.emptyText}>Nenhum livro encontrado.</Text></View>}
            </>
          }

          ListFooterComponent={
            <View style={styles.footerContainer}>
              <View style={styles.socialRow}>
                 <TouchableOpacity><Ionicons name="logo-facebook" size={24} color={colors.white} /></TouchableOpacity>
                 <TouchableOpacity><Ionicons name="logo-instagram" size={24} color={colors.white} /></TouchableOpacity>
                 <TouchableOpacity><Ionicons name="logo-twitter" size={24} color={colors.white} /></TouchableOpacity>
                 <TouchableOpacity><Ionicons name="logo-linkedin" size={24} color={colors.white} /></TouchableOpacity>
              </View>
              <Text style={styles.footerText}>© 2025 Circularis - Todos os direitos reservados.</Text>
              <View style={styles.footerLinksContainer}>
                 <TouchableOpacity onPress={() => navigation.navigate('Termos')}>
                    <Text style={styles.footerLinkText}>Termos de Uso</Text>
                 </TouchableOpacity>
                 <Text style={{color: colors.white, fontSize: 12}}> e </Text>
                 <TouchableOpacity onPress={() => navigation.navigate('Privacidade')}>
                    <Text style={styles.footerLinkText}>Privacidade</Text>
                 </TouchableOpacity>
              </View>
            </View>
          }
        />
      </View>

      {/* MENU INFERIOR MANUAL REMOVIDO DAQUI */}
      
      <CustomAlert visible={alertVisible} title={alertTitle} message={alertMsg} type={alertType} onClose={() => setAlertVisible(false)} />
    </View>
  );
}