import React from 'react'
import { View } from 'react-native'
import { Topbar } from '../components/Topbar.js'
import { CustomButton } from '../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import styles from '../styles/Welcome.js'
import { useTranslation } from 'react-i18next'
import CircularSegments from '../components/GroupTimeCircle.js'


export default function WelcomeScreen() {
  const navigation = useNavigation()
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Topbar title={t('welcome')} showGoBackButton={false} />

      <View style={styles.contentContainer}>
        <View></View>
        <View style={styles.buttonsContainer}>
          <CustomButton title={t('sign-up')} onPress={() => navigation.navigate('SignUp')} />
          <CustomButton
            title={t('sign-in')}
            onPress={() => navigation.navigate('SignIn')} 
            style={{backgroundColor: '#d8bcfc'}}
          />
          <CustomButton
            title={t('guest')}
            onPress={() => navigation.navigate('Home')}
            style={{backgroundColor: '#d8bcfc'}}
          />        
        </View>
      </View>
    </View>
  )
}
