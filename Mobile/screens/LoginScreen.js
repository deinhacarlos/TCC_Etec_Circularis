import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + tokenSalvo
      }
    })
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* ILUSTRAÇÃO NO TOPO */}
      <Image
        source={require("../assets/login.png")}
        style={styles.illustration}
        resizeMode="contain"
      />

      <Text style={styles.title}>Login</Text>

      {/* CAMPO DE EMAIL */}
      <View style={styles.inputWrapper}>
        <Feather name="mail" size={20} color="#99A" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="seuemail@exemplo.com"
          placeholderTextColor="#A0A0A0"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      {/* CAMPO DE SENHA */}
      <View style={styles.inputWrapper}>
        <Feather name="lock" size={20} color="#99A" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          placeholderTextColor="#A0A0A0"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          autoCapitalize="none"
        />
      </View>

      {/* BOTÃO LOGIN */}
      <TouchableOpacity
        style={[
          styles.button,
          (!email || !senha) && { opacity: 0.7 },
        ]}
        onPress={handleLogin}
        disabled={!email || !senha}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* LINK DE CADASTRO */}
      <View style={styles.registerRow}>
        <Text style={styles.registerGray}>Não tem conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CadastroUsuarioScreen")}>
          <Text style={styles.registerLink}> Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Estilos visuais da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  illustration: {
    width: "100%",
    maxWidth: 320,
    height: 170,
    marginBottom: 24,
    marginTop: -35,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#212121",
    alignSelf: "center",
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    width: "100%",
    height: 50,
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#212121",
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#21C366", 
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  registerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    marginTop: 7,
  },
  registerGray: {
    color: "#A0A0A0",
    fontSize: 15,
  },
  registerLink: {
    color: "#49B3FF",
    fontSize: 15,
    fontWeight: "bold",
  },
});
