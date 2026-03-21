import { Appbar } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import React from 'react'

export function Topbar({ title, showGoBackButton}) {
  const navigation = useNavigation()

  return (
      <Appbar.Header style={styles.topBar} mode='center-aligned'>
          {showGoBackButton &&
            <Appbar.BackAction onPress={() => {navigation.goBack()}} />
          }
          <Appbar.Content titleStyle={styles.titleText} title={title} />
      </Appbar.Header>
  )
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#f8ecf4'
  },
  titleText: {
    fontWeight: 'bold'
  }
})
