import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-around'
  },
  nameInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40
  },
  nameInputHalf: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameInput: {
    width: 144,
    backgroundColor: '#FAF5FF',
    paddingRight: 32,
    borderBottomColor: 'black',
    borderBottomWidth: 0.8
  },
  clearNameIcon: {
    position: 'absolute',
    right: 4
  },
  credentialsInputRow: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  credentialsInput: {
    width: 328,
    backgroundColor: '#FAF5FF',
    paddingRight: 32,
    borderBottomColor: 'black',
    borderBottomWidth: 0.8
  },
  clearCredentialsIcon: {
    position: 'absolute',
    right: Platform.OS === 'ios' ? 35 : 45
  },
  bottomContainer: {

    alignItems: 'center'
  },
  bottomText: {
    flexDirection: 'row',
    marginTop: 20
  },
  signInText: {
    fontSize: 16
  },
  signInTextLink: {
    color: '#427ddb',
    fontSize: 16
  }
})
