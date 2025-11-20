import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
 
// Componente principal da tela de Cadastro de Livro
export default function CadastroMateriaisScreen() {
  // Estados do formulário para cada campo
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [estadoLivro, setEstadoLivro] = useState("");
  const [cidade, setCidade] = useState("");
  const [cep, setCep] = useState("");
  // Futuro: Imagem/capa do livro (ao implementar upload real)
 
  // Checa se todos os campos obrigatórios foram preenchidos
  const camposPreenchidos = titulo && autor && categoria
&& descricao && estadoLivro && cidade && cep;
 
  // Função executada ao clicar no botão de cadastrar
  const handleCadastro = () => {
    // Adicione aqui validação, integração com API, etc.
    // Ex: enviar dados do livro para o backend
  };
 
  return (
    // KeyboardAvoidingView evita que o teclado cubra inputs no mobile
<KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
>
      {/* ScrollView permite rolagem e torna acessível em telas menores */}
<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
 
        {/* IMAGEM DE ILUSTRAÇÃO NO TOPO */}
<Image
          source={require("../assets/addbook.png")} // Altere para sua imagem
          style={styles.illustration}
          resizeMode="contain"
        />
 
        {/* TÍTULO DA PÁGINA */}
<Text style={styles.title}>Cadastrar Livro</Text>
 
        {/* Campo - Título do Livro */}
<TextInput
          style={styles.input}
          placeholder="Título"
          placeholderTextColor="#999"
          value={titulo}
          onChangeText={setTitulo}
        />
 
        {/* Campo - Nome do Autor */}
<TextInput
          style={styles.input}
          placeholder="Nome do autor"
          placeholderTextColor="#999"
          value={autor}
          onChangeText={setAutor}
        />
 
        {/* Campo - Categoria/Literatura */}
<TextInput
          style={styles.input}
          placeholder="Categoria (Ex: Fantasia, Romance, Suspense...)"
          placeholderTextColor="#999"
          value={categoria}
          onChangeText={setCategoria}
        />
 
        {/* Campo - Descrição do Livro (textarea) */}
<TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descrição breve"
          placeholderTextColor="#999"
          multiline
          value={descricao}
          onChangeText={setDescricao}
        />
 
        {/* Campo - Estado do Livro */}
<TextInput
          style={styles.input}
          placeholder="Estado do Livro (Ex: Novo, Usado, etc.)"
          placeholderTextColor="#999"
          value={estadoLivro}
          onChangeText={setEstadoLivro}
        />
 
        {/* Campo - Cidade */}
<TextInput
          style={styles.input}
          placeholder="Cidade"
          placeholderTextColor="#999"
          value={cidade}
          onChangeText={setCidade}
        />
 
        {/* Campo - CEP */}
<TextInput
          style={styles.input}
          placeholder="CEP"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={cep}
          onChangeText={setCep}
        />
 
        {/* Botão de upload/capa do livro (visual, sem funcionalidade real ainda) */}
<TouchableOpacity style={styles.uploadBox}>
<Text style={styles.uploadText}>Adicionar capa do livro (opcional)</Text>
</TouchableOpacity>
 
        {/* BOTÃO DE CADASTRAR - Desabilitado se campos obrigatórios faltando */}
<TouchableOpacity
          style={[styles.button, !camposPreenchidos && { opacity: 0.6 }]}
          onPress={handleCadastro}
          disabled={!camposPreenchidos}
>
<Text style={styles.buttonText}>Cadastrar Livro</Text>
</TouchableOpacity>
 
      </ScrollView>
</KeyboardAvoidingView>
  );
}
 
// Estilos visuais da tela
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingVertical: 40,
    backgroundColor: "#FFF",
  },
  illustration: {
    width: 230,
    height: 160,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#F8F8F8",
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 15,
  },
  uploadBox: {
    width: "100%",
    height: 120,
    borderWidth: 1,
    borderColor: "#BBB",
    borderRadius: 10,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  uploadText: {
    color: "#6A5AE0",
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#6A5AE0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#110C0C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});