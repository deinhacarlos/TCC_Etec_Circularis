import { StyleSheet } from 'react-native';
import { colors } from './colors';

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.lightGray || '#F9F9F9',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },
  
  /* Card Container */
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  /* Títulos */
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.darkText,
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.grayText,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },

  /* Labels e Inputs */
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 6,
    marginTop: 15,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.darkText,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  /* Select Simulado */
  selectButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 15,
    color: colors.darkText,
  },
  placeholderText: {
    color: '#999',
  },

  /* Grid */
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  colCity: {
    flex: 2,
  },
  colUF: {
    flex: 1,
  },

  /* Upload */
  uploadArea: {
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#CFCFCF',
    borderStyle: 'dashed',
    borderRadius: 10,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  uploadIcon: {
    marginBottom: 10,
  },
  uploadText: {
    color: colors.grayText,
    fontSize: 14,
  },
  btnSelectImage: {
    marginTop: 10,
    backgroundColor: colors.primaryPurple,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  btnSelectImageText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },

  /* Botão Principal */
  submitButton: {
    backgroundColor: colors.primaryPurple,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* --- ÁREA FIXA DO FOOTER --- */
  footerArea: {
    width: '100%', 
    height: 100,
    paddingVertical: 2,
    paddingHorizontal: 0, 
    backgroundColor: '#000000', 
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Modal de Seleção */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    maxHeight: '80%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: colors.darkText,
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  optionText: {
    fontSize: 16,
    color: colors.darkText,
  },
  closeModalButton: {
    marginTop: 15,
    alignItems: 'center',
    padding: 10,
  },
  closeModalText: {
    color: colors.errorRed,
    fontWeight: 'bold',
  },
});