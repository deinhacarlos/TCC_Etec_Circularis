// src/styles/HomeStyles.js
import { StyleSheet } from 'react-native';
import { colors } from './colors';

export default StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 32,
    backgroundColor: colors.white,
  },

  /* HEADER */
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
  },

  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 30,
    height: 30,
    marginRight: 6,
  },

  logoText: {
    fontFamily: 'Caprasimo-Regular',
    fontSize: 14,
    color: colors.grayText,
  },

  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerLogin: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: colors.darkText,
    marginRight: 16,
    fontWeight: 'bold',
  },

  headerSignup: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.cadastroBlue,
    borderRadius: 6,
  },

  headerSignupText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: colors.cadastroBlue,
    fontWeight: 'bold',
  },

  /* SECTIONS */

  // bloco 1: lilás + imagem logo embaixo
  firstSection: {
    marginTop: 12,
    marginBottom: 0,
  },
  section: {
    marginTop: 16,
    marginBottom: 20,
  },
  sectionTextBox: {
    backgroundColor: colors.secondaryPurple,
    paddingVertical: 24,
    paddingHorizontal: 24,

  },
  sectionTitle: {
    fontFamily: 'Caprasimo-Regular',
    fontSize: 16,
    color: colors.darkText,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 6,
    marginHorizontal: 20,
  },
  sectionText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: colors.grayText,
    textAlign: 'center',
    marginBottom: 10,
    marginHorizontal: 12,
  },
  thirdSectionText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: colors.grayText,
    textAlign: 'center',
    marginTop: -1,      // sobe/encosta um pouco mais na imagem de cima
    marginBottom: 12,
    marginHorizontal: 32,
  },

  // imagem do BLOCO 1 (home1)
  sectionImage: {
    width: '100%',
    height: 320,
  },

  // imagem do BLOCO 2 (home2) 
  sectionImageTop: {
    width: '100%',
    height: 320,
    marginBottom: 12,
  },

  // imagem do BLOCO 3 (home3) 
  sectionImageMiddle: {
    width: '100%',
    height: 320,
    marginTop: -40,
    marginBottom: 12,
  },

  firstExchangeButton: {
    marginTop: 8,
    alignItems: 'center',
  },

  forgotLink: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: colors.cadastroBlue,
    textDecorationLine: 'underline',
  },
  termsFooter: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,      
    marginBottom: 8,
  },

  termsText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  termsLink: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: '#4DA3FF',
    textDecorationLine: 'underline',
  },


});
