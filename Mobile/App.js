// App.js

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Caprasimo_400Regular } from '@expo-google-fonts/caprasimo';
import { Nunito_400Regular } from '@expo-google-fonts/nunito';

// Telas
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import MainTabs from './src/navigation/MainTabs';
import TermosScreen from './src/screens/TermosScreen';
import PrivacidadeScreen from './src/screens/PrivacidadeScreen';
import MeusMateriaisScreen from './src/screens/MeusMateriaisScreen';
import TrocasScreen from './src/screens/TrocasScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import ChatScreen from './src/screens/ChatScreen';
import CadastroMaterialScreen from './src/screens/CadastroMaterialScreen';
import RecuperarSenhaScreen from './src/screens/RecuperarSenhaScreen';
import RedefinirSenhaScreen from './src/screens/RedefinirSenhaScreen';
import ConfigContaScreen from './src/screens/ConfigContaScreen';

import SplashScreen from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Caprasimo-Regular': Caprasimo_400Regular,
    'Nunito-Regular': Nunito_400Regular,
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) return null;

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Landing */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* Autenticação */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerTitle: 'Login' }}
        />
        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
          options={{ headerTitle: 'Cadastro' }}
        />

        {/* Área logada (menu inferior) */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        {/* Telas secundárias */}
        <Stack.Screen
          name="Termos"
          component={TermosScreen}
          options={{ headerTitle: 'Termos de uso' }}
        />
        <Stack.Screen
          name="Privacidade"
          component={PrivacidadeScreen}
          options={{ headerTitle: 'Política de privacidade' }}
        />
        <Stack.Screen
          name="MeusMateriais"
          component={MeusMateriaisScreen}
          options={{ headerTitle: 'Meus materiais' }}
        />
        <Stack.Screen
          name="Trocas"
          component={TrocasScreen}
          options={{ headerTitle: 'Minhas trocas' }}
        />
        <Stack.Screen
          name="Perfil"
          component={PerfilScreen}
          options={{ headerTitle: 'Perfil' }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ headerTitle: 'Chat' }}
        />
        <Stack.Screen
          name="CadastroMaterial"
          component={CadastroMaterialScreen}
          options={{ headerTitle: 'Cadastrar material' }}
        />
        <Stack.Screen
          name="RecuperarSenha"
          component={RecuperarSenhaScreen}
          options={{ headerTitle: 'Recuperar senha' }}
        />
        <Stack.Screen
          name="RedefinirSenha"
          component={RedefinirSenhaScreen}
          options={{ headerTitle: 'Redefinir senha' }}
        />
        <Stack.Screen
          name="ConfigConta"
          component={ConfigContaScreen}
          options={{ headerTitle: 'Configurações da conta' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
