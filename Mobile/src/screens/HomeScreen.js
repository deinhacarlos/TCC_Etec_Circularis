// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/HomeStyles';
import TermsFooter from '../components/TermsFooter';


export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoArea}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
          <Text style={styles.logoText}>circularis</Text>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.headerLogin}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerSignup}
            onPress={() => navigation.navigate('Cadastro')}
          >
            <Text style={styles.headerSignupText}>Cadastrar-se</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BLOCO 1 */}
      <View style={styles.firstSection}>
        <View style={styles.sectionTextBox}>
          <Text style={styles.sectionTitle}>Seja Bem-vindo ao Circularis App!</Text>
          <Text style={styles.sectionText}>
            Agora você pode cadastrar e trocar livros a qualquer hora, direto do seu celular!
          </Text>
        </View>

        <Image
          source={require('../../assets/home1.png')}
          style={styles.sectionImage}
          resizeMode="cover"
        />
      </View>

      {/* BLOCO 2 + CONECTE-SE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Troque Livros, Salve o Planeta</Text>
        <Text style={styles.sectionText}>
          Dê uma nova vida aos seus livros. Compartilhe
          suas histórias e encontre novas aventuras sem
          custo, contribuíndo para uma Planeta mais verde.
        </Text>

        <Image
          source={require('../../assets/home2.png')}
          style={styles.sectionImageTop}
          resizeMode="cover"
        />

        {/* AGORA COLADO NA home2 */}
        <Text style={styles.sectionTitle}>Conecte-se com Leitores</Text>
        <Text style={styles.thirdSectionText}>
          Faça parte de uma comunidade apaixonada por livros. Descubra novos amigos
          e Troque recomendações em um ambiente amigável e sustentável.
        </Text>
      </View>

      {/* BLOCO 3 – só home3 + “Simples, Rápido e Intuitivo” */}
      <View style={styles.section}>
        <Image
          source={require('../../assets/home3.png')}
          style={styles.sectionImageMiddle}
          resizeMode="cover"
        />

        <Text style={styles.sectionTitle}>Simples, Rápido e Intuitivo</Text>
        <Text style={styles.sectionText}>
          Nossa interface foi desenhada para ser fácil de usar. Cadastre livros, proponha trocas.
        </Text>

        <TouchableOpacity
          style={styles.firstExchangeButton}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.sectionText}>
            É novo por aqui?{' '}
            <Text style={styles.forgotLink}>Faça sua primeira troca</Text>
          </Text>
        </TouchableOpacity>
      </View>
      <TermsFooter
        onPressTerms={() => navigation.navigate('Termos')}
        onPressPrivacy={() => navigation.navigate('Privacidade')}
      />
    </ScrollView>

  );
}
