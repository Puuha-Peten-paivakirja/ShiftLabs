import { Appbar } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import React from 'react'

export function Topbar({title}) {
  return (
      <Appbar.Header style={styles.topBar} mode='center-aligned'>
          <Appbar.BackAction onPress={() => {}} />
          <Appbar.Content titleStyle={styles.titleText} title={title} />
      </Appbar.Header>
  )
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#FAF5FF'
  },
  titleText: {
    fontWeight: 'bold'
  }
})
