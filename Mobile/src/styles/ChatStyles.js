// src/styles/ChatStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  messageLeft: {
    justifyContent: 'flex-start',
  },
  messageRight: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  bubbleLeft: {
    backgroundColor: '#F0F0F0',
  },
  bubbleRight: {
    backgroundColor: '#4B5EFF',
  },
  messageText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 2,
    color: '#777777',
    textAlign: 'right',
  },
  inputBar: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#4B5EFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
  },
});
