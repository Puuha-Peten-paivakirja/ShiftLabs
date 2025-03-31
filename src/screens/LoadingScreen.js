import { View, ActivityIndicator } from 'react-native'
import styles from '../styles/Loading.js'

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' animating={true} />
    </View>
  )
}
