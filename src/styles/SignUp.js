import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  nameInputRow: {
    marginTop: 80,
    marginHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  nameInputHalf: {
    flexDirection: 'row',
  },
  nameInput: {
    width: Platform.OS === 'ios' ? 130 : 120,
    height: 40,
    backgroundColor: '#FAF5FF',
    paddingRight: Platform.OS === 'ios' ? 40 : 32,
    paddingLeft: Platform.OS === 'ios' ? 4 : 4,
    borderBottomColor: 'black',
    borderBottomWidth: 0.8,
  },
  clearNameIcon: {
    position: 'absolute',
    right: Platform.OS === 'ios' ? 18 : 8,
    top: 10,
  },
  credentialsInputRow: {
    marginTop: 20,
  },
  credentialsInput: {
    alignSelf: 'center',
    width: 285,
    height: 40,
    backgroundColor: '#FAF5FF',
    paddingRight: Platform.OS === 'ios' ? 40 : 32,
    paddingLeft: Platform.OS === 'ios' ? 4 : 4,
    borderBottomColor: 'black',
    borderBottomWidth: 0.8,
  },
  clearCredentialsIcon: {
    position: 'absolute',
    right: 70,
    top: 10,
  },
})
