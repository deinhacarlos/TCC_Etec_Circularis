import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

export default StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Nunito-Regular',
    fontSize: 20,
    color: colors.darkText,
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: colors.darkText,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: 'bold', 
  },
  sectionText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: colors.grayText,
    textAlign: 'center',
    marginBottom: 4,
  },
});
