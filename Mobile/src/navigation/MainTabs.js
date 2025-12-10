import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../styles/colors';

// Importação das telas
import BuscaScreen from '../screens/BuscaScreen';
import ChatScreen from '../screens/ChatScreen';
import CadastroMaterialScreen from '../screens/CadastroMaterialScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Busca"
      screenOptions={({ route }) => ({
        headerShown: false, // Esconde o cabeçalho padrão
        tabBarActiveTintColor: colors.primaryPurple, // Roxo quando ativo
        tabBarInactiveTintColor: colors.grayText,    // Cinza quando inativo
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          elevation: 10, // Sombra no Android
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Nunito-Regular',
          marginBottom: 4,
        },
        // --- CONFIGURAÇÃO DOS ÍCONES ---
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Busca') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'CadastroMaterial') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // Ajuste de tamanho se necessário
          return <Ionicons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Busca" 
        component={BuscaScreen} 
        options={{ tabBarLabel: 'Início' }} 
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ tabBarLabel: 'Chat' }}
      />
      <Tab.Screen 
        name="CadastroMaterial" 
        component={CadastroMaterialScreen} 
        options={{ tabBarLabel: 'Cadastrar' }} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{ tabBarLabel: 'Perfil' }} 
      />
    </Tab.Navigator>
  );
}