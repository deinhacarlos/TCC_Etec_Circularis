// src/styles/RedefinirSenhaStyles.js
import { StyleSheet } from 'react-native';
import { colors } from './colors';

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
    backgroundColor: colors.white,
  },

  container: {
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 40,
  },

  /* Logo e Cabeçalho */
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    color: colors.darkText,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  subtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 15,
    color: colors.grayText,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
    maxWidth: '90%',
  },

  /* Formulário */
  formContainer: {
    width: '100%',
  },

  label: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: colors.darkText,
    marginBottom: 8,
    fontWeight: '600',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#F5F5F5', // Igual ao seu CSS .form-control
    height: 50,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: colors.darkText,
  },

  iconButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Botão Principal */
  button: {
    backgroundColor: colors.successGreen, // #5FD068
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  buttonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },

  /* Link de Voltar */
  backButton: {
    marginTop: 30,
    padding: 10,
  },
  
  backText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: '#4891E3', // Azul do seu CSS cadastro-link a
    textAlign: 'center',
  },
});