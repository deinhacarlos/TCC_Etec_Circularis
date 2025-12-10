// src/styles/ConfigContaStyles.js
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
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Caprasimo-Regular',
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#00A86B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
  },
  passwordButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#4B5EFF',
  },
  passwordButtonText: {
    color: '#4B5EFF',
    fontSize: 15,
    fontFamily: 'Nunito-Regular',
  },
});
