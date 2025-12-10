// src/styles/LoginStyles.js
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background || '#F5F6FA',
  },

  container: {
    paddingBottom: 32,
    backgroundColor: colors.white,
  },

  banner: {
    width: '100%',
    height: 260,
  },

  subtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    textAlign: 'center',
    color: colors.grayText,
    marginBottom: 20,
    marginTop: 24, 
    marginHorizontal: 20,
  },
  
  linkText: {
    color: colors.successGreen,
    fontFamily: 'Nunito-Regular',
  },

  label: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: colors.darkText,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 4,
    fontWeight: 'bold',
  },

  input: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.inputBorder || '#D0D5DD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Nunito-Regular',
    fontSize: 15,
    color: colors.darkText,
  },

  /* --- CONTAINER DE SENHA --- */
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.inputBorder || '#D0D5DD',
    borderRadius: 8,
  },
  inputPassword: {
    flex: 1,
    fontFamily: 'Nunito-Regular',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.darkText,
  },
  eyeIcon: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* --- MENSAGEM DE ERRO ESTILIZADA --- */
  errorText: {
    color: colors.errorRed || '#FF4757', // Garante vermelho mesmo se não tiver no colors
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  /* ----------------------------------- */

  forgotRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 18,
  },

  forgotText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    color: colors.grayText,
    marginRight: 4,
  },

  forgotLink: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: colors.cadastroBlue,
  },

  button: {
    marginHorizontal: 20,
    backgroundColor: colors.successGreen,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 4,
  },

  buttonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },

  signupText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: colors.grayText,
  },

  signupLink: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: colors.cadastroBlue,
  },
});