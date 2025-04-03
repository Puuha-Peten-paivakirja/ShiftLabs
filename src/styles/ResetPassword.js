import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContent: {
    bottom: 80,
  },
  title: {
    alignSelf: 'center',
    bottom: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    alignSelf: 'center',
    fontSize: 16,
  },
  credentialsInput: {
    width: 328,
    backgroundColor: '#e6e0e9',
    paddingRight: 32,
    borderBottomColor: 'black',
    borderBottomWidth: 0.8
  },
  clearCredentialsIcon: {
    position: 'absolute',
    right: Platform.OS === 'ios' ? 35 : 45
  },
  buttonContainer: {
    top: 72
  }
})
