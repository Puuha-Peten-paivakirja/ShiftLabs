import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  profilePictureContainer: {
    marginTop: 20
  },
  profilePicture: {
    height: 160,
    width: 160,
    borderRadius: 80
  },
  editContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  editNameRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 4
  },
  editNameHalf: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameInput: {
    width: 144,
    backgroundColor: '#e6e0e9',
    paddingRight: 32,
    borderBottomColor: 'black',
    borderBottomWidth: 0.8
  },
  clearNameIcon: {
    position: 'absolute',
    right: 4
  },
  confirmAndCancel: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 4
  },
  confirmButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 40,
    backgroundColor: '#228B22',
    borderRadius: 4,
  },
  cancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 40,
    backgroundColor: '#D22B2B',
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  notEditingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%'
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '60%'
  },
  textStyle: {
    fontSize: 16
  },
  editIcon: {
    position: 'absolute',
    right: 40
  },
  editRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center'
  },
  input: {
    width: 292,
    backgroundColor: '#e6e0e9',
    paddingRight: 32,
    borderBottomColor: 'black',
    borderBottomWidth: 0.8
  },
  clearIcon: {
    position: 'absolute',
    right: Platform.OS === 'ios' ? 4 : 3.5
  },
})
