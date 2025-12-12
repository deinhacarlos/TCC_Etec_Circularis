// src/screens/SplashScreen.js

import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { colors } from '../styles/colors';

export default function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >

      <Image source={require('../../assets/logo.png')} style={{ width: 120, height: 120, marginBottom: 20 }} />

      <Text
        style={{
          fontFamily: 'Caprasimo-Regular',
          fontSize: 28,
          color: '#5a5c5fff',
          marginBottom: 8,
        }}
      >
        Circularis
      </Text>

      <Text
        style={{
          fontFamily: 'Nunito-Regular',
          fontSize: 14,
          color: '#5a5c5fff',
          marginBottom: 24,
        }}
      >
        Economia circular em suas mãos
      </Text>

      <ActivityIndicator size="large" color="#5a5c5fff" />
    </View>
  );
}
