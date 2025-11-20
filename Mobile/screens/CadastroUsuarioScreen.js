import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
 
export default function CadastroUsuarioScreen({ navigation }) {
  // Estados para armazenar os dados preenchidos
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
 
  return (
<ScrollView contentContainerStyle={styles.container}>
      {/** ILUSTRAÇÃO NO TOPO */}
<Image
        source={require("../assets/register.png")}  // coloque a imagem desejada
        style={styles.illustration}
        resizeMode="contain"
      />
 
      {/** TÍTULO */}
<Text style={styles.title}>Crie sua conta</Text>
 
      {/** CAMPO — NOME COMPLETO */}
<TextInput
        style={styles.input}
        placeholder="Nome Completo"
        placeholderTextColor="#999"
        value={nome}
        onChangeText={setNome}
      />
 
      {/** CAMPO — EMAIL */}
<TextInput
        style={styles.input}
        placeholder="Endereço de e-mail"
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
 
      {/** CAMPO — SENHA */}
<TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
 
      {/** CAMPO — CONFIRMAR SENHA */}
<TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />
 
      {/** BOTÃO DE CADASTRO */}
<TouchableOpacity style={styles.button}>
<Text style={styles.buttonText}>Cadastrar</Text>
</TouchableOpacity>
 
      {/** IR PARA LOGIN */}
<TouchableOpacity onPress={() => navigation.navigate("Login")}>
<Text style={styles.loginLink}>
          Já possui uma conta? <Text style={styles.loginBold}>Faça login</Text>
</Text>
</TouchableOpacity>
 
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingTop: 40,
    paddingBottom: 60,
  },
 
  illustration: {
    width: 250,
    height: 180,
    marginBottom: 10,
  },
 
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333",
    marginBottom: 25,
  },
 
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#F8F8F8",
    fontSize: 16,
  },
 
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#6A5AE0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
 
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
 
  loginLink: {
    color: "#333",
    fontSize: 15,
  },
 
  loginBold: {
    color: "#6A5AE0",
    fontWeight: "600",
  },
});
