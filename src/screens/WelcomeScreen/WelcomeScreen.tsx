import { Text, TouchableOpacity, View } from 'react-native'
import { styles } from './WelcomeScreen.styles'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '@/types'

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>
}

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Угадай Флаг 🌍</Text>
      <Text style={styles.subtitle}>Проверь свои знания стран мира!</Text>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Quiz')}
      >
        <Text style={styles.buttonText}>Начать игру</Text>
      </TouchableOpacity>
    </View>
  )
}
