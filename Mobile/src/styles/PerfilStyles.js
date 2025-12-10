import { StyleSheet } from 'react-native';
import { colors } from './colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9', // Fundo cinza claro igual web
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },

  /* --- CABEÇALHO DO PERFIL (FOTO) --- */
  headerProfile: {
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primaryPurple,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarInitial: {
    fontSize: 40,
    color: colors.white,
    fontWeight: 'bold',
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primaryPurple,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.darkText,
    marginTop: 8,
  },
  userEmail: {
    fontSize: 14,
    color: colors.grayText,
  },

  /* --- CARD DE DADOS --- */
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    elevation: 2,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkText,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: colors.grayText,
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.darkText,
  },
  inputDisabled: {
    backgroundColor: '#F0F0F0',
    color: '#777',
  },

  /* --- BOTÕES DE AÇÃO --- */
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  btnPrimary: {
    backgroundColor: colors.primaryPurple,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primaryPurple,
  },
  btnDanger: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: colors.errorRed,
    marginTop: 10,
  },
  
  btnTextWhite: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnTextPurple: {
    color: colors.primaryPurple,
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnTextRed: {
    color: colors.errorRed,
    fontWeight: 'bold',
    fontSize: 15,
  },

  /* --- MENU EXTRA (IGUAL SIDEBAR WEB) --- */
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuText: {
    fontSize: 16,
    color: colors.darkText,
    marginLeft: 15,
    flex: 1,
  },
});