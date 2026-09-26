# План нашего курса (React Native + Expo + TS):

| Урок | Описание |
| ---- | -------- |
| **👉 1** | Инициализация проекта, настройка навигации и типизация данных. Подготовка стартового экрана. |
| 2 | Логика викторины — перемешивание массива, генерация 4 уникальных вариантов (без дублей) и механика подсветки (зеленый/красный) при клике. |
| 3 | Экран результатов, подсчет очков и сброс состояния. |

Переход из веба в мобильную разработку — логичный и очень интересный шаг.

Поскольку ты уже отлично знаешь React и TypeScript, освоить React Native будет легко. Единственный важный нюанс: **в React Native нет HTML-тегов (`div`, `span`, `img`) и привычного CSS/CSS Modules**. Вместо них мы используем встроенные компоненты (`View`, `Text`, `Image`) и `StyleSheet` (объекты стилей, которые работают по принципам Flexbox, очень похоже на CSS Modules).

---

### Технологии

- React Native
- Expo
- TypeScript

---

## Урок 1: Базовая настройка и Стартовый экран

### 1. Инициализация проекта и установка навигации (установлены)

Открой терминал и создай новый проект Expo с шаблоном TypeScript:

```bash
npx create-expo-app rn-quiz-app -t expo-template-blank-typescript
cd rn-quiz-app
```

В мобильных приложениях нет URL-адресов, поэтому вместо `react-router-dom` стандартом является `React Navigation`. Установим его:

```bash
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

### 2. Подготовка данных и типов

Создай в корне проекта папку `src`, а в ней — две подпапки: `data` и `screens`.

1. Создай файл **`src/data/quiz_questions.json`** и вставь туда весь твой JSON с вопросами и массивом стран.
2. Создай файл **`src/types.ts`** для описания структур (раз уж мы пишем на TS):

```typescript
// src/types.ts
export interface Question {
  question: string;
  correctAnswer: string;
  flag: string;
}

export interface QuizData {
  questions: Question[];
  countries: string[];
}

// Типизация для навигации
export type RootStackParamList = {
  Welcome: undefined;
  Quiz: undefined;
};
```

### 3. Создание стартового экрана (Welcome Screen)

В React Native стили пишутся через `StyleSheet.create`. Обрати внимание, как `div` превратился в `View`, а `p`/`h1` — в `Text`.

Создай файл **`src/screens/WelcomeScreen.tsx`**:

```tsx
// src/screens/WelcomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Угадай Флаг 🌍</Text>
      <Text style={styles.subtitle}>Проверь свои знания стран мира!</Text>

      {/* TouchableOpacity — это аналог <button> с анимацией нажатия */}
      <TouchableOpacity 
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Quiz')}
      >
        <Text style={styles.buttonText}>Начать игру</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Занимает весь экран (как height: 100vh)
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 3, // Тень для Android
    shadowColor: '#000', // Тени для iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

### 4. Настройка точки входа

Теперь соберем навигацию в главном файле. Создай файл-заглушку `src/screens/QuizScreen.tsx` (мы наполним его во втором уроке):

```tsx
// src/screens/QuizScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function QuizScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Здесь будет викторина</Text>
    </View>
  );
}
```

И обнови корень приложения — файл **`App.tsx`** (в корне проекта):

```tsx
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ headerShown: false }} // Скрываем верхнюю шапку
        />
        <Stack.Screen 
          name="Quiz" 
          component={QuizScreen} 
          options={{ title: 'Викторина' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Запуск!

Выполни в терминале:

```bash
npx expo start
```

Скачай на телефон приложение **Expo Go** (iOS/Android), отсканируй QR-код из терминала камерой телефона и посмотри на свой первый мобильный экран. При клике на кнопку должен происходить плавный переход на экран викторины.
