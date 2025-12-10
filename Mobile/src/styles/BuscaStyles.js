// src/styles/BuscaStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },

  /* --- HEADER --- */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    elevation: 4,
    shadowColor: colors.darkText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },

  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkText,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  iconButton: {
    padding: 4,
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.primaryPurple,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.white,
  },

  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: 'bold',
  },

  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarInitial: {
    color: colors.white,
    fontWeight: 'bold',
  },

  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  /* --- CONTAINER --- */
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  /* --- BUSCA --- */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    height: 48,
    paddingHorizontal: 16,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.darkText,
    marginLeft: 8,
  },

  /* --- BANNER --- */
  bannerContainer: {
    width: '100%',
    height: 220,
    backgroundColor: colors.secondaryPurple,
    marginBottom: 20,
  },

  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  /* --- FILTROS --- */
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 15,
  },

  filterLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.darkText,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.white,
    minWidth: 140,
    justifyContent: 'space-between',
  },

  filterButtonText: {
    fontSize: 14,
    color: colors.darkText,
  },

  dropdownList: {
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 4,
    maxHeight: 200,
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },

  dropdownText: {
    fontSize: 14,
    color: colors.darkText,
  },

  /* --- LISTA --- */
  listContent: {
    paddingBottom: 20, // Reduzi de 90 para 20 pois não tem mais menu flutuante por cima
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    color: colors.grayText,
    fontSize: 14,
  },

  /* --- CARD --- */
  card: {
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.lightGray,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.darkText,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },

  cardContent: {
    padding: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkText,
    marginBottom: 4,
  },

  cardAuthor: {
    fontSize: 14,
    color: colors.grayText,
    marginBottom: 12,
  },

  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: colors.lightGray,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },

  cardTagText: {
    fontSize: 12,
    color: colors.grayText,
    marginLeft: 6,
  },

  actionButton: {
    backgroundColor: colors.primaryPurple,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: '#DDD',
  },

  actionButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },

  /* --- FOOTER --- */
  footerContainer: {
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#000000',
    alignItems: 'center',
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
  },

  footerText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },

  footerLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  footerLinkText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: '#4DA3FF',
    textDecorationLine: 'underline',
  },
});