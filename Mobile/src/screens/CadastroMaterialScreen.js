import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
  StatusBar
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/CadastroMaterialStyles';
import { colors } from '../styles/colors';
import { apiPost, getUserId } from '../Api'; // <--- CORREÇÃO: Importando apiPost

// Componentes
import CustomAlert from '../components/CustomAlert';
import TermsFooter from '../components/TermsFooter';

const TIPOS_MATERIAL = ['Livro', 'Mochila', 'Estojo', 'Kit escolar', 'Coleção de lápis', 'Caderno', 'Outro'];
const CONSERVACAO = ['Novo', 'Bom', 'Regular', 'Ruim'];
const ESTADOS_UF = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

export default function CadastroMaterialScreen({ navigation }) {
  const [tipo, setTipo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [conservacao, setConservacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [imagem, setImagem] = useState(null);

  const [loading, setLoading] = useState(false);

  // Modais e Alertas
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [currentField, setCurrentField] = useState(''); 

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const openSelector = (field) => {
    setCurrentField(field);
    if (field === 'tipo') {
      setModalData(TIPOS_MATERIAL);
      setModalTitle('Selecione o Tipo');
    } else if (field === 'conservacao') {
      setModalData(CONSERVACAO);
      setModalTitle('Estado de Conservação');
    } else if (field === 'uf') {
      setModalData(ESTADOS_UF);
      setModalTitle('Selecione o Estado');
    }
    setModalVisible(true);
  };

  const handleSelectOption = (item) => {
    if (currentField === 'tipo') setTipo(item);
    else if (currentField === 'conservacao') setConservacao(item);
    else if (currentField === 'uf') setUf(item);
    setModalVisible(false);
  };

  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permissão Negada', 'Precisamos de acesso à galeria para enviar a foto.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImagem(result.assets[0]);
    }
  };

  const handleCadastrar = async () => {
    if (!tipo) return showAlert('Campo Obrigatório', 'Selecione o tipo de material.');
    if (!titulo || titulo.length < 3) return showAlert('Campo Obrigatório', 'O título deve ter pelo menos 3 caracteres.');
    if (!conservacao) return showAlert('Campo Obrigatório', 'Selecione o estado de conservação.');
    if (!cidade) return showAlert('Campo Obrigatório', 'Informe a cidade.');
    if (!uf) return showAlert('Campo Obrigatório', 'Selecione o estado (UF).');
    if (!imagem) return showAlert('Imagem Necessária', 'Selecione uma imagem do material.');

    setLoading(true);

    try {
      const idUsuario = await getUserId();
      if (!idUsuario) throw new Error('Usuário não logado');

      const formData = new FormData();
      formData.append('Titulo', titulo.trim());
      formData.append('Autor', autor.trim());
      formData.append('Categoria', categoria.trim());
      formData.append('TipoMaterial', tipo);
      formData.append('EstadoConservacao', conservacao);
      formData.append('Descricao', descricao.trim());
      formData.append('IdUsuarioFK', idUsuario);
      
      const localizacaoCombinada = `${cidade.trim()}/${uf}`;
      formData.append('Localizacao', localizacaoCombinada);
      formData.append('Objetivo', 'troca');

      const uriParts = imagem.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('Imagem', {
        uri: imagem.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      // --- ATENÇÃO: MUDANÇA IMPORTANTE AQUI ---
      // A função apiPost do seu Api.js usa JSON.stringify no body automaticamente.
      // Como estamos enviando FormData (arquivo), precisamos fazer o fetch manualmente aqui
      // ou criar uma função apiPostFormData no Api.js. 
      // Vou fazer a chamada fetch direta aqui para garantir que funcione com upload.
      
      const token = await import('../Api').then(m => m.getToken());
      const API_URL = await import('../Api').then(m => m.API_URL); // Pega a URL do seu Api.js

      const response = await fetch(`${API_URL}/api/materiais`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // NÃO colocar 'Content-Type': 'multipart/form-data' aqui manualmente, 
          // o fetch faz isso sozinho quando vê FormData e adiciona o boundary correto.
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro no servidor');
      }

      showAlert('Sucesso!', 'Material cadastrado com sucesso.');
      setTitulo(''); setAutor(''); setCategoria(''); setDescricao(''); setCidade(''); setImagem(null); setTipo(''); setConservacao(''); setUf('');

    } catch (error) {
      console.error(error);
      showAlert('Erro', 'Não foi possível cadastrar. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Cadastrar novo livro ou material</Text>
          <Text style={styles.subtitle}>
            Preencha os detalhes para disponibilizar livros, mochilas, estojos, 
            coleções, kits escolares e outros itens escolares usados para troca.
          </Text>

          {/* SELECT TIPO */}
          <Text style={styles.label}>Tipo de Material</Text>
          <TouchableOpacity style={styles.selectButton} onPress={() => openSelector('tipo')}>
            <Text style={tipo ? styles.selectText : styles.placeholderText}>{tipo || 'Selecione...'}</Text>
            <Ionicons name="chevron-down" size={20} color={colors.grayText} />
          </TouchableOpacity>

          {/* TÍTULO */}
          <Text style={styles.label}>Nome do Livro ou Material</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex: Mochila Spider-Man usada" 
            placeholderTextColor="#999" 
            value={titulo} 
            onChangeText={setTitulo}
            autoCapitalize="sentences"
          />

          {/* AUTOR */}
          <Text style={styles.label}>Autor / Marca (opcional)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex: Faber-Castell, J.K. Rowling" 
            placeholderTextColor="#999" 
            value={autor} 
            onChangeText={setAutor}
            autoCapitalize="words"
          />

          {/* CATEGORIA */}
          <Text style={styles.label}>Categoria (opcional)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex: Fantasia, Escolar" 
            placeholderTextColor="#999" 
            value={categoria} 
            onChangeText={setCategoria}
            autoCapitalize="sentences"
          />

          {/* SELECT CONSERVAÇÃO */}
          <Text style={styles.label}>Estado de Conservação</Text>
          <TouchableOpacity style={styles.selectButton} onPress={() => openSelector('conservacao')}>
            <Text style={conservacao ? styles.selectText : styles.placeholderText}>{conservacao || 'Selecione...'}</Text>
            <Ionicons name="chevron-down" size={20} color={colors.grayText} />
          </TouchableOpacity>

          {/* DESCRIÇÃO (TEXT AREA) */}
          <Text style={styles.label}>Descrição Breve</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Descreva o estado, detalhes..." 
            placeholderTextColor="#999" 
            multiline 
            numberOfLines={4} 
            value={descricao} 
            onChangeText={setDescricao}
            textAlignVertical="top" 
          />

          {/* LOCALIZAÇÃO */}
          <View style={styles.row}>
            <View style={styles.colCity}>
              <Text style={styles.label}>Cidade</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: São Paulo" 
                placeholderTextColor="#999" 
                value={cidade} 
                onChangeText={setCidade}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.colUF}>
              <Text style={styles.label}>UF</Text>
              <TouchableOpacity style={styles.selectButton} onPress={() => openSelector('uf')}>
                <Text style={uf ? styles.selectText : styles.placeholderText}>{uf || 'UF'}</Text>
                <Ionicons name="chevron-down" size={16} color={colors.grayText} />
              </TouchableOpacity>
            </View>
          </View>

          {/* UPLOAD IMAGEM */}
          <Text style={styles.label}>Imagem</Text>
          <TouchableOpacity style={styles.uploadArea} onPress={escolherImagem}>
            {imagem ? (
              <Image source={{ uri: imagem.uri }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="cloud-upload-outline" size={40} color={colors.primaryPurple} style={styles.uploadIcon} />
                <Text style={styles.uploadText}>Toque para enviar foto</Text>
                <View style={styles.btnSelectImage}>
                  <Text style={styles.btnSelectImageText}>Selecionar Imagem</Text>
                </View>
                <Text style={{ marginTop: 8, fontSize: 10, color: '#999', textAlign: 'center' }}>
                  Formatos suportados: JPG, PNG, GIF, WebP (Max 5MB)
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* BOTÃO */}
          <TouchableOpacity style={styles.submitButton} onPress={handleCadastrar} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>Cadastrar</Text>}
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* FOOTER FIXO */}
      <View style={styles.footerArea}>
        <TermsFooter 
          onPressTerms={() => navigation.navigate('Termos')} 
          onPressPrivacy={() => navigation.navigate('Privacidade')} 
        />
      </View>

      {/* MODAL */}
      <Modal transparent={true} visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <FlatList
              data={modalData}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.optionItem} onPress={() => handleSelectOption(item)}>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <CustomAlert visible={alertVisible} title={alertTitle} message={alertMessage} onClose={() => setAlertVisible(false)} />
    </View>
  );
}