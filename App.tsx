import { QuizScreen, WelcomeScreen } from "@/screens"
import { RootStackParamList } from "@/types"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ title: 'Викторина' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
