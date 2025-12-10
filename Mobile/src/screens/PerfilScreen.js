import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/PerfilStyles';
import { colors } from '../styles/colors';
import { apiGet, apiPut, apiPostAuth, getUserId, API_URL } from '../Api';
import CustomAlert from '../components/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PerfilScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});
  
  // Campos do Formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [foto, setFoto] = useState(null); 

  // Alerta
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: '', msg: '', type: 'info' });

  const showAlert = (title, msg, type = 'info') => {
    setAlertData({ title, msg, type });
    setAlertVisible(true);
  };

  useFocusEffect(useCallback(() => {
    carregarPerfil();
  }, []));

  const carregarPerfil = async () => {
    setLoading(true);
    try {
      const id = await getUserId();
      if (!id) return navigation.replace('Login');

      const data = await apiGet(`/usuarios/${id}`);
      setUserData(data);
      
      setNome(data.Nome_Completo || '');
      setEmail(data.Email || '');
      setEndereco(data.Endereco || '');
      
      if (data.FotoPerfil && data.FotoPerfil !== 'padrao.png') {
        setFoto(`${API_URL}/uploads/${data.FotoPerfil}`);
      } else {
        setFoto(null);
      }

    } catch (error) {
      console.error(error);
      showAlert('Erro', 'Não foi possível carregar o perfil.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTrocarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return showAlert('Permissão', 'Precisamos acessar a galeria.', 'warning');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const novaImagem = result.assets[0];
      setFoto(novaImagem.uri); 
      uploadFoto(novaImagem);
    }
  };

  const uploadFoto = async (imageAsset) => {
    try {
      const id = await getUserId();
      const formData = new FormData();
      
      const uriParts = imageAsset.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('FotoPerfil', {
        uri: imageAsset.uri,
        name: `profile.${fileType}`,
        type: `image/${fileType}`,
      });

      const token = await import('../Api').then(m => m.getToken());
      await fetch(`${API_URL}/api/usuarios/foto/${id}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
      });
      
      showAlert('Sucesso', 'Foto de perfil atualizada!', 'success');
    } catch (error) {
      console.error(error);
      showAlert('Erro', 'Falha ao enviar a foto.', 'error');
    }
  };

  const handleSalvar = async () => {
    setSaving(true);
    try {
      const id = await getUserId();
      const payload = {
        Nome_Completo: nome.trim(),
        Endereco: endereco.trim()
      };

      await apiPut(`/usuarios/${id}`, payload);
      
      showAlert('Sucesso', 'Perfil atualizado com sucesso!', 'success');
      setIsEditing(false); 
      carregarPerfil(); 

    } catch (error) {
      console.error(error);
      showAlert('Erro', 'Não foi possível atualizar os dados.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  if (loading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color={colors.primaryPurple} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* CABEÇALHO */}
        <View style={styles.headerProfile}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleTrocarFoto}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {nome.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.editIconBadge}>
              <Ionicons name="camera" size={18} color="#FFF" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.userName}>{nome}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        {/* DADOS PESSOAIS */}
        <View style={styles.cardContainer}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:15}}>
             <Text style={styles.sectionTitle}>Dados Pessoais</Text>
             {!isEditing && (
               <TouchableOpacity onPress={() => setIsEditing(true)}>
                 <Text style={{color: colors.primaryPurple, fontWeight:'bold'}}>Editar</Text>
               </TouchableOpacity>
             )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={nome}
              onChangeText={setNome}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail (Não alterável)</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={email}
              editable={false} 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Localização / Endereço</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={endereco}
              onChangeText={setEndereco}
              editable={isEditing}
              placeholder="Ex: São Paulo - SP"
            />
          </View>

          {isEditing && (
            <View style={{marginTop: 10}}>
              <TouchableOpacity style={[styles.actionButton, styles.btnPrimary]} onPress={handleSalvar} disabled={saving}>
                {saving ? <ActivityIndicator color="#FFF"/> : <Text style={styles.btnTextWhite}>Salvar Alterações</Text>}
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.btnOutline]} onPress={() => { setIsEditing(false); carregarPerfil(); }}>
                <Text style={styles.btnTextPurple}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* MENU */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Menu</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MeusMateriais')}>
            <Ionicons name="book-outline" size={22} color={colors.darkText} />
            <Text style={styles.menuText}>Meus Livros/Materiais</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Trocas')}>
            <Ionicons name="swap-horizontal-outline" size={22} color={colors.darkText} />
            <Text style={styles.menuText}>Minhas Trocas</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          {/* --- NOVO ITEM: NOTIFICAÇÕES --- */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Notificacoes')}>
            <Ionicons name="notifications-outline" size={22} color={colors.darkText} />
            <Text style={styles.menuText}>Notificações</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Configuracoes')}>
            <Ionicons name="settings-outline" size={22} color={colors.darkText} />
            <Text style={styles.menuText}>Configurações de Conta</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={[styles.actionButton, styles.btnDanger]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.errorRed} style={{marginRight:8}}/>
          <Text style={styles.btnTextRed}>Sair da Conta</Text>
        </TouchableOpacity>

      </ScrollView>

      <CustomAlert 
        visible={alertVisible} 
        title={alertData.title} 
        message={alertData.msg} 
        type={alertData.type}
        onClose={() => setAlertVisible(false)} 
      />
    </View>
  );
}