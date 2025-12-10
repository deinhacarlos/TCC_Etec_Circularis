// src/styles/RecuperarSenhaStyles.js
import { StyleSheet } from 'react-native';
import { colors } from './colors';

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background || '#F5F6FA',
  },

  container: {
    flexGrow: 1,
    backgroundColor: colors.white,
    paddingBottom: 32,
  },

  /* --- HEADER / BANNER --- */
  bannerContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  banner: {
    width: '100%',
    height: 220, // Um pouco menor que o do login
  },

  /* --- TEXTOS --- */
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 22,
    color: colors.darkText,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
    fontWeight: 'bold',
  },

  subtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: colors.grayText,
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 30,
    lineHeight: 20,
  },

  /* --- FORMULÁRIO --- */
  label: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: colors.darkText,
    marginHorizontal: 20,
    marginBottom: 8,
    fontWeight: 'bold',
  },

  input: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: 'Nunito-Regular',
    fontSize: 15,
    color: colors.darkText,
  },

  /* --- BOTÃO --- */
  button: {
    marginHorizontal: 20,
    backgroundColor: colors.successGreen, // Verde igual ao Login
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    elevation: 2,
  },

  buttonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  /* --- VOLTAR --- */
  backButton: {
    alignSelf: 'center',
    padding: 10,
  },

  backText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: colors.cadastroBlue, // Azul do link
  },
});