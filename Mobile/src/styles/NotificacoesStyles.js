// src/styles/NotificacoesStyles.js
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Caprasimo-Regular',
  },
  markAll: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#4B5EFF',
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
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  cardUnread: {
    backgroundColor: '#F3F5FF',
    borderColor: '#4B5EFF',
  },
  cardRead: {
    backgroundColor: '#F8F8F8',
    borderColor: '#DDDDDD',
  },
  cardType: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#4B5EFF',
    marginBottom: 4,
  },
  cardMessage: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#333333',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 11,
    fontFamily: 'Nunito-Regular',
    color: '#777777',
  },
});
