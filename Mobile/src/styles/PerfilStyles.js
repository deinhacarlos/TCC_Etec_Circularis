// src/styles/PerfilStyles.js
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#00A86B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Caprasimo-Regular',
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Caprasimo-Regular',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#555555',
  },
  userSchool: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#777777',
    marginTop: 2,
  },
  userCity: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#777777',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Caprasimo-Regular',
    marginBottom: 8,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#333333',
  },
  logoutButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF5555',
  },
  logoutButtonText: {
    color: '#FF5555',
    fontSize: 15,
    fontFamily: 'Nunito-Regular',
  },
});
