// Importações principais do projeto (Expo e React Native)
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Função principal do App que será renderizada em tela
export default function App() {
  return (
    // View é o container principal, equivalente a uma div na web
    <View style={styles.container}>
      {/* Exibe um texto orientativo para o usuário */}
      <Text>Open up App.js to start working on your app!</Text>
      {/* Componente de StatusBar do Expo */}
      <StatusBar style="auto" />
    </View>
  );
}

// Estilos para os componentes, feito com o StyleSheet do React Native
const styles = StyleSheet.create({
  container: {
    flex: 1, // Usa toda a área disponível na tela
    backgroundColor: '#fff', // Fundo branco
    alignItems: 'center', // Centraliza horizontalmente
    justifyContent: 'center', // Centraliza verticalmente
  },
});
