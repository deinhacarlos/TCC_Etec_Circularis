// src/styles/CadastroStyles.js
import { StyleSheet } from 'react-native';
import { colors } from './colors';

export default StyleSheet.create({
  container: {
    paddingBottom: 32,
    backgroundColor: colors.white,
  },
  heroImage: {
    width: '100%',
    height: 220,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontFamily: 'Caprasimo-Regular',
    fontSize: 24,
    textAlign: 'center',
    color: colors.darkText,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    textAlign: 'center',
    color: colors.grayText,
    marginBottom: 20,
  },
  linkText: {
    color: colors.successGreen,
    fontFamily: 'Nunito-Regular',
  },
  label: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: colors.darkText,
    marginBottom: 4,
    marginTop: 8,
    fontWeight: 'bold',
  },
  
  // --- Input Padrão ---
  input: {
    marginBottom: 8,
    backgroundColor: colors.white,
    fontFamily: 'Nunito-Regular',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.darkText,
  },

  // --- Container Customizado para Senha ---
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#D0D5DD',
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

  // --- MENSAGEM DE ERRO ESTILIZADA ---
  errorText: {
    color: colors.errorRed || '#FF4757', // Vermelho
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  // -----------------------------------

  cadastrarButton: {
    backgroundColor: colors.cadastroBlue,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8, // Ajustei levemente pois agora tem o erro acima
  },
  cadastrarButtonText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  footerText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    color: colors.grayText,
    textAlign: 'center',
    marginTop: 16,
  },
  footerLink: {
    color: colors.successGreen,
    fontFamily: 'Nunito-Regular',
  },
});