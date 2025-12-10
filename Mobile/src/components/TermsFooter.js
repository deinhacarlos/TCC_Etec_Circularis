// src/components/TermsFooter.js
import React from 'react';
import { View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import styles from '../styles/HomeStyles';

export default function TermsFooter({ onPressTerms, onPressPrivacy }) {
  return (
    <View style={styles.termsFooter}>
      <View style={styles.socialRow}>
        <FontAwesome name="facebook-square" size={22} color="#FFFFFF" />
        <FontAwesome name="instagram" size={22} color="#FFFFFF" />
        <FontAwesome name="twitter" size={22} color="#FFFFFF" />
        <FontAwesome name="linkedin-square" size={22} color="#FFFFFF" />
      </View>

      <Text style={styles.termsText}>
        Ao usar o Circularis, você concorda com nossos{' '}
        <Text style={styles.termsLink} onPress={onPressTerms}>
          Termos de Uso
        </Text>{' '}
        e com a{' '}
        <Text style={styles.termsLink} onPress={onPressPrivacy}>
          Política de Privacidade
        </Text>.
      </Text>
    </View>
  );
}
