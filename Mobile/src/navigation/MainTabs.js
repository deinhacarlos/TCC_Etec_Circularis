import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BuscaScreen from '../screens/BuscaScreen';
import ChatScreen from '../screens/ChatScreen';
import CadastroMaterialScreen from '../screens/CadastroMaterialScreen';
import PerfilScreen from '../screens/PerfilScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4B5EFF',
        tabBarInactiveTintColor: '#777777',
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Livros"
        component={BuscaScreen}
        options={{ tabBarLabel: 'Início' }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatScreen}
        options={{ tabBarLabel: 'Chat' }}
      />
      <Tab.Screen
        name="CadastroLivroTab"
        component={CadastroMaterialScreen}
        options={{ tabBarLabel: 'Cadastrar Livro' }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={PerfilScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}
