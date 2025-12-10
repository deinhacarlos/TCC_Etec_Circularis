// src/styles/MeusMateriaisStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  banner: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Caprasimo-Regular',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#555555',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#00A86B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
  },
  secondaryButton: {
    borderColor: '#00A86B',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: '#00A86B',
    fontSize: 15,
    fontFamily: 'Nunito-Regular',
  },
  loader: {
    marginTop: 24,
  },
  emptyText: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#777777',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  cardImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImagePlaceholderText: {
    fontSize: 10,
    color: '#777777',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardCategory: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#00A86B',
    marginBottom: 2,
  },
  cardDetails: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#555555',
  },
});
