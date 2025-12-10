// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Caprasimo_400Regular } from '@expo-google-fonts/caprasimo';
import { Nunito_400Regular } from '@expo-google-fonts/nunito';

// Importação das Telas
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import MainTabs from './src/navigation/MainTabs'; // Onde fica o menu inferior
import TermosScreen from './src/screens/TermosScreen';
import PrivacidadeScreen from './src/screens/PrivacidadeScreen';
import MeusMateriaisScreen from './src/screens/MeusMateriaisScreen';
import TrocasScreen from './src/screens/TrocasScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import ChatScreen from './src/screens/ChatScreen';
import CadastroMaterialScreen from './src/screens/CadastroMaterialScreen';
import RecuperarSenhaScreen from './src/screens/RecuperarSenhaScreen';
import RedefinirSenhaScreen from './src/screens/RedefinirSenhaScreen';

// Se tiver uma tela de recuperação de senha, importe aqui
// import RecuperarSenhaScreen from './src/screens/RecuperarSenhaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Caprasimo-Regular': Caprasimo_400Regular,
    'Nunito-Regular': Nunito_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        
        {/* Tela Inicial (Landing Page) */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* Autenticação */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Login',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="RecuperarSenha"
          component={RecuperarSenhaScreen}
          options={{
            title: 'Recuperar Senha',
            headerTitleAlign: 'center',
          }}
        />

        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
          options={{
            title: 'Cadastro',
            headerTitleAlign: 'center',
          }}
        />

        {/* --- ÁREA LOGADA (IMPORTANTE) ---
           MainTabs contém: Busca (Livros), Chat, CadastroMaterial e Perfil.
           Essa é a rota que exibe o menu inferior.
        */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        {/* Telas Secundárias (que abrem "por cima" do menu ou são modais) */}
        
        <Stack.Screen
          name="Termos"
          component={TermosScreen}
          options={{
            title: 'Termos de Uso',
            headerTitleAlign: 'center',
          }}
        />

        <Stack.Screen
          name="Privacidade"
          component={PrivacidadeScreen}
          options={{
            title: 'Política de Privacidade',
            headerTitleAlign: 'center',
          }}
        />

        <Stack.Screen
          name="MeusMateriais"
          component={MeusMateriaisScreen}
          options={{
            title: 'Meus Materiais',
            headerTitleAlign: 'center',
          }}
        />

        <Stack.Screen
          name="Trocas"
          component={TrocasScreen}
          options={{
            title: 'Minhas Trocas',
            headerTitleAlign: 'center',
          }}
        />

        {/* Observação: Perfil e Chat já costumam estar dentro do MainTabs.
           Deixamos aqui apenas se quiser abrir de forma "avulsa" em algum momento,
           mas a navegação principal deve ser pelo MainTabs.
        */}
        <Stack.Screen
          name="Perfil"
          component={PerfilScreen}
          options={{
            title: 'Meu Perfil',
            headerTitleAlign: 'center',
          }}
        />

        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            title: 'Chat',
            headerTitleAlign: 'center',
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}