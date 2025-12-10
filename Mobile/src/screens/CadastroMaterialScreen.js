// src/screens/CadastroMaterialScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ícone de upload
import styles from '../styles/CadastroMaterialStyles';
import { apiPostAuth, getUserId } from '../Api'; // Certifique-se de importar getUserId
import TermsFooter from '../components/TermsFooter';

export default function CadastroMaterialScreen({ navigation }) {
  // Campos baseados no Web + Protótipo
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState(''); // Novo
  const [categoria, setCategoria] = useState(''); // Ex: Romance, Terror (Gênero)
  const [tipoMaterial, setTipoMaterial] = useState(''); // Ex: Livro, Revista (Backend: TipoMaterial)
  const [estadoConservacao, setEstadoConservacao] = useState(''); // Ex: Novo, Usado
  const [descricao, setDescricao] = useState('');
  const [cidade, setCidade] = useState(''); // Novo
  const [estadoUF, setEstadoUF] = useState(''); // Novo
  const [imagem, setImagem] = useState(null);
  
  const [loading, setLoading] = useState(false);

  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para enviar a foto do livro.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImagem(result.assets[0]);
    }
  };

  const handleSalvar = async () => {
    // Validação igual ao Web
    if (!titulo || !autor || !categoria || !tipoMaterial || !estadoConservacao || !cidade || !estadoUF || !imagem) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios e selecione uma imagem.');
      return;
    }

    setLoading(true);

    try {
      const idUsuario = await getUserId();
      if (!idUsuario) throw new Error('Usuário não identificado');

      const formData = new FormData();

      // Mapeamento EXATO do backend (igual cadastro-material-script.js)
      formData.append('Titulo', titulo.trim());
      formData.append('Autor', autor.trim());
      formData.append('Descricao', descricao.trim());
      formData.append('TipoMaterial', tipoMaterial.trim()); // Atenção à chave
      formData.append('EstadoConservacao', estadoConservacao.trim());
      formData.append('Categoria', categoria.trim());
      formData.append('IdUsuarioFK', idUsuario);
      
      // Lógica de Localização combinada (Cidade/UF)
      const localizacaoCombinada = `${cidade.trim()}/${estadoUF.trim().toUpperCase()}`;
      formData.append('Localizacao', localizacaoCombinada);
      
      // Valor fixo exigido pelo backend
      formData.append('Objetivo', 'troca');

      // Tratamento da imagem
      const uriParts = imagem.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('Imagem', {
        uri: imagem.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      // Envio
      await apiPostAuth('/materiais', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Sucesso', 'Livro cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('MeusMateriais') },
      ]);
      
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao cadastrar. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Simples (opcional, já que o Stack Navigator tem header) */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Cadastrar Livro</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.label}>Título *</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          outlineColor="#E0E0E0"
          activeOutlineColor="#8282F8"
          placeholder="O nome do livro"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Autor *</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          outlineColor="#E0E0E0"
          activeOutlineColor="#8282F8"
          placeholder="Nome do autor"
          value={autor}
          onChangeText={setAutor}
        />

        <Text style={styles.label}>Gênero (Categoria) *</Text>
        <TextInput
          mode="outlined"
          style={styles.input}
          outlineColor="#E0E0E0"
          activeOutlineColor="#8282F8"
          placeholder="Ex: Fantasia, Romance, Suspense"
          value={categoria}
          onChangeText={setCategoria}
        />

        <View style={styles.row}>
          <View style={[styles.col, { marginRight: 8 }]}>
            <Text style={styles.label}>Tipo *</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor="#8282F8"
              placeholder="Livro/Revista"
              value={tipoMaterial}
              onChangeText={setTipoMaterial}
            />
          </View>
          <View style={styles.col}>
             <Text style={styles.label}>Conservação *</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor="#8282F8"
              placeholder="Novo/Usado"
              value={estadoConservacao}
              onChangeText={setEstadoConservacao}
            />
          </View>
        </View>

        <Text style={styles.label}>Descrição Breve</Text>
        <TextInput
          mode="outlined"
          style={styles.textArea}
          outlineColor="#E0E0E0"
          activeOutlineColor="#8282F8"
          placeholder="Conte um pouco sobre o livro..."
          multiline
          numberOfLines={4}
          value={descricao}
          onChangeText={setDescricao}
        />

        <View style={styles.row}>
          <View style={[styles.col, { flex: 2, marginRight: 8 }]}>
            <Text style={styles.label}>Cidade *</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor="#8282F8"
              placeholder="Sua cidade"
              value={cidade}
              onChangeText={setCidade}
            />
          </View>
          <View style={[styles.col, { flex: 1 }]}>
            <Text style={styles.label}>Estado (UF) *</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor="#8282F8"
              placeholder="SP"
              maxLength={2}
              autoCapitalize="characters"
              value={estadoUF}
              onChangeText={setEstadoUF}
            />
          </View>
        </View>

        <Text style={styles.label}>Capa do Livro *</Text>
        <TouchableOpacity style={styles.uploadArea} onPress={escolherImagem}>
          {imagem ? (
            <Image source={{ uri: imagem.uri }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="cloud-upload-outline" size={32} color="#8282F8" />
              <Text style={styles.uploadText}>Toque para selecionar uma imagem</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSalvar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Cadastrar livro</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
      
      {/* Footer removido ou mantido conforme preferência, no protótipo é navegação por abas */}
    </View>
  );
}