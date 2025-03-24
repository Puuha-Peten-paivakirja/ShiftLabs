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
  upperEmpty: {
    height: 56,
  },
  lowerEmpty: {
    height: 56,
    marginTop: 40
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