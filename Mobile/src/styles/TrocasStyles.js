// src/styles/TrocasStyles.js
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
  center: {
    alignItems: 'center',
    marginTop: 24,
  },
  helperTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    marginBottom: 4,
  },
  helperText: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#777777',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  cardStatus: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#00A86B',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    fontWeight: 'bold',
    marginTop: 4,
  },
  cardText: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#333333',
  },
  cardUser: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#555555',
    marginTop: 6,
  },
});
