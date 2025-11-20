import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.mainContainer}>
      {/* Topo fixo */}
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/images/Logo.png")} style={styles.logo} />
        </View>
        <View style={styles.topButtons}>
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cadastroButton}
            onPress={() => navigation.navigate("CadastroUsuarioScreen")}
          >
            <Text style={styles.cadastroText}>Cadastrar-se</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />
      {/* Conteúdo rolável */}
      <ScrollView style={styles.container}>
        {/* Banner no topo */}
        <View style={styles.bannerSection}>
          <Text style={styles.welcomeTitle}>Seja Bem-vindo ao Circularis App!</Text>
          <Text style={styles.welcomeText}>
            Agora você pode cadastrar e trocar livros a qualquer hora, direto do seu celular!
          </Text>
        </View>
        {/* Seções informativas */}
        <Image
          source={require("../assets/images/home1.png")}
          style={styles.sectionImage}
        />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Troque Livros, Salve o Planeta</Text>
          <Text style={styles.sectionText}>
            Dê uma nova vida aos seus livros. Compartilhe suas histórias e encontre 
            novas aventuras sem custo, contribuindo para um planeta mais verde.
          </Text>
        </View>
        <Image
          source={require("../assets/images/home2.png")}
          style={styles.sectionImage}
        />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conecte-se com Leitores</Text>
          <Text style={styles.sectionText}>
            Faça parte de uma comunidade apaixonada por livros. Descubra novos amigos e troque recomendações em um ambiente amigável e sustentável.
          </Text>
        </View>
        <Image
          source={require("../assets/images/home3.png")}
          style={styles.sectionImage}
        />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Simples, Rápido e Intuitivo</Text>
          <Text style={styles.sectionText}>
            Nossa interface foi desenhada para ser fácil de usar. Cadastre livros, proponha trocas.
          </Text>
          <View style={styles.linkRow}>
            <Text style={styles.linkQuestion}>É novo por aqui? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
              <Text style={styles.linkAction}>Faça sua primeira troca</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.divider} />
      {/* Rodapé fixo */}
      <View style={styles.footer}>
        <View style={styles.socialIcon}>
          <MaterialCommunityIcons name="facebook" size={32} color="#1D2128" style={styles.iconSpacing} />
          <MaterialCommunityIcons name="instagram" size={32} color="#1D2128" style={styles.iconSpacing} />
          <MaterialCommunityIcons name="twitter" size={32} color="#1D2128" style={styles.iconSpacing} />
        </View>
        <Text style={styles.footerText}>© 2025 Circularis</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFAFE",
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    width: "100%",
    marginTop: 10,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
    marginTop: 30,
    padding: 15,
    backgroundColor: "#fff",
  },
  logo: {
    width: 90,
    height: 60,
    resizeMode: "contain",
    marginRight: 8,
    marginTop: 10,
  },
  topButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    fontFamily: "WorkSans",
    color: "#110C0C",
    fontSize: 16,
    marginRight: 10,
    fontWeight: "bold",
  },
  cadastroButton: {
    borderWidth: 1,
    borderColor: "#49B3FF",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cadastroText: {
    color: "#49B3FF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "WorkSans",
  },
  divider: {
    height: 2,
    backgroundColor: "#F3F4F6",
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFAFE",
  },
  bannerSection: {
    height: 160,
    backgroundColor: "#EFD6FF",
    borderRadius: 18,
    marginHorizontal: 14,
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    zIndex: 1,
  },
  welcomeTitle: {
    fontSize: 18,
    marginTop: 25,
    color: "#110C0C",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Caprasimo",
  },
  welcomeText: {
    fontSize: 16,
    color: "#1D2128",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 24,
    fontFamily: "WorkSans",
  },
  section: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#110C0C",
    marginBottom: 4,
    textAlign: "center",
    lineHeight: 24,
    fontFamily: "Caprasimo",
  },
  sectionText: {
    fontSize: 14,
    color: "#1D2128",
    fontFamily: "WorkSans",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 10,
  },
  sectionImage: {
    width: "100%",
    height: 300,
    zIndex: 2,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 6,
  },
  linkQuestion: {
    fontSize: 14,
    color: "#1D2128",
    fontFamily: "WorkSans",
    textAlign: "center",
  },
  linkAction: {
    fontSize: 14,
    color: "#49B3FF",
    fontFamily: "WorkSans",
    textAlign: "center",
    textDecorationLine: "underline",
    marginLeft: 3,
  },

  footer: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 10,
    color: "#1D2128",
    fontFamily: "WorkSans",
    padding: 10,
  },
  socialIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  iconSpacing: {
    marginHorizontal: 12,
  },
});
