import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>O FUTURO É CIRCULAR</Text>
        <Text style={styles.chip}>Conheça agora</Text>
      </View>

      {/* Seção: O que é a Circularis */}
      <View style={styles.sectionWhite}>
        <Text style={styles.sectionTitle}>O que é a Circularis?</Text>
        <Text style={styles.sectionText}>
          Circularis é uma plataforma colaborativa para troca, doação e 
          reaproveitamento de materiais estudantis, promovendo sustentabilidade e inclusão.
        </Text>
        <Image source={require('../assets/images/section1.png')} style={styles.sectionImage} />
      </View>

      {/* Seção: Como funciona? */}
      <View style={styles.sectionPurple}>
        <Text style={styles.sectionTitle}>Como funciona?</Text>
        <Text style={styles.sectionText}>
          Os estudantes cadastram materiais ou procuram o que precisam. A plataforma facilita 
          a comunicação e a logística das trocas e doações.
        </Text>
        <Image source={require('../assets/images/section2.png')} style={styles.sectionImage} />
      </View>

      {/* Seção: Benefícios */}
      <View style={styles.sectionWhite}>
        <Text style={styles.sectionTitle}>Quais os benefícios?</Text>
        <Text style={styles.sectionText}>
          Incentiva o consumo consciente, reduz desperdício, facilita o acesso a materiais 
          fortalece a comunidade escolar.
        </Text>
        <Image source={require('../assets/images/section3.png')} style={styles.sectionImage} />
      </View>

      {/* Seção: Junte-se à comunidade */}
      <View style={styles.sectionYellow}>
        <Text style={styles.sectionTitle}>Junte-se à comunidade!</Text>
        <Text style={styles.sectionText}>
          Cadastre-se para oferecer ou receber materiais e participe desse movimento 
          sustentável entre estudantes.
        </Text>
        <Image source={require('../assets/images/section4.png')} style={styles.sectionImage} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5FF' 
  },
  header: { 
    alignItems: 'center', 
    backgroundColor: '#E7EAFD', 
    padding: 28, 
    paddingTop: 44 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  chip: {
    backgroundColor: '#4ADC87',
    color: '#33202F',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 8,
  },
  sectionWhite: {
    backgroundColor: '#FFF',
    padding: 18,
    marginBottom: 6,
  },
  sectionPurple: {
    backgroundColor: '#F2EAFE',
    padding: 18,
    marginBottom: 6,
  },
  sectionYellow: {
    backgroundColor: '#FFEFC2',
    padding: 18,
    marginBottom: 6,
  },
  sectionImage: {
    width: '100%',
    height: 120,
    marginTop: 16,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
  },
});
