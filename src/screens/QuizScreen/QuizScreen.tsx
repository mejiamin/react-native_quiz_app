import { View, Text, TouchableOpacity, Image } from 'react-native'
import { styles } from './QuizScreen.styles'

export default function QuizScreen() {

  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>
        Вопрос 1 из 10
      </Text>

      <Text style={styles.questionText}>Флаг какой страны изображен? </Text>

      <Image
        style={styles.flagImage}
        resizeMode="contain"
      />

      <View style={styles.optionsContainer}>
        {/* options.map((option, index) */}
        <TouchableOpacity
          style={styles.optionButton}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>Флаг</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.nextButtonText}>
          Дальше →
        </Text>
      </TouchableOpacity>
    </View>
  )
}