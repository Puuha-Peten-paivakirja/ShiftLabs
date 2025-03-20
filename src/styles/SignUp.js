import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  nameInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 80,
    gap: 40
  },
  nameInputHalf: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameInput: {
    width: 120,
    height: 40,
    backgroundColor: '#FAF5FF',
    paddingRight: 36,
    paddingLeft: 4,
    borderBottomColor: 'black',
    borderBottomWidth: 0.8,
  },
  clearNameIcon: {
    position: 'absolute',
    right: 4,
  },
  credentialsInputRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  credentialsInput: {
    width: 280,
    height: 40,
    backgroundColor: '#FAF5FF',
    paddingRight: 36,
    paddingLeft: 4,
    borderBottomColor: 'black',
    borderBottomWidth: 0.8,
  },
  clearCredentialsIcon: {
    position: 'absolute',
    right: Platform.OS === 'ios' ? 59 : 69.5
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  }
})
