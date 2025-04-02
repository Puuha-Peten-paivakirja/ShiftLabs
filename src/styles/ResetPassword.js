import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  credentialsInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
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
})
