import { View, ActivityIndicator } from 'react-native'
import styles from '../styles/Loading.js'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'

export default function LoadingScreen() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('appLanguage')

        if (savedLanguage) {
          i18n.changeLanguage(savedLanguage)
        }
      }
      catch (error) {
        console.log(error)
      }
    }

    fetchLanguage()
  }, [])

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' animating={true} />
    </View>
  )
}
