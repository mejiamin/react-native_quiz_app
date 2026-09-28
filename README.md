# План нашего курса (React Native + Expo + TS):

| Урок | Описание |
| ---- | -------- |
| 1 | Инициализация проекта, настройка навигации и типизация данных. Подготовка стартового экрана. |
| **👉 2** | Логика викторины — перемешивание массива, генерация 4 уникальных вариантов (без дублей) и механика подсветки (зеленый/красный) при клике. |
| 3 | Экран результатов, подсчет очков и сброс состояния. |

Переход из веба в мобильную разработку — логичный и очень интересный шаг.

Поскольку ты уже отлично знаешь React и TypeScript, освоить React Native будет легко. Единственный важный нюанс: **в React Native нет HTML-тегов (`div`, `span`, `img`) и привычного CSS/CSS Modules**. Вместо них мы используем встроенные компоненты (`View`, `Text`, `Image`) и `StyleSheet` (объекты стилей, которые работают по принципам Flexbox, очень похоже на CSS Modules).

---

### Технологии

- React Native
- Expo
- TypeScript

---

## Урок 2: Игровая логика, варианты ответов без дублей и реактивная интерактивность

В этом уроке мы полностью напишем `QuizScreen.tsx`. Нам нужно:

1. Загрузить вопросы из JSON и динамически генерировать 4 варианта ответов для текущего вопроса.
2. Исключить совпадение: название страны из правильного ответа **не должно попадать** в 3 случайных неправильных варианта.
3. Добавить обработку клика с интерактивной подсветкой:
* Правильный вариант красится в **зеленый**.
* Неверный выбранный — в **красный**.
* Все варианты блокируются от повторных кликов до перехода к следующему вопросу.



---

### Шаг 1: Код `QuizScreen.tsx`

Замени весь код в файле **`src/screens/QuizScreen.tsx`** на следующий:

```tsx
// src/screens/QuizScreen.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import quizData from '../data/quiz_questions.json';
import { Question } from '../types';

// 1. Чистая функция перемешивания массива (Алгоритм Фишера-Йетса)
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

// 2. Генерация 4 вариантов ответов (1 правильный + 3 случайных без дублей)
function generateOptions(
  correctAnswer: string, 
  allCountries: string[],
): string[] {
  // Фильтруем: убираем правильный ответ из пула возможных неправильных
  const wrongCountriesFiltered = 
    allCountries.filter(country => country !== correctAnswer);

  // Перемешиваем и берем первые 3
  const randomWrongAnswers = shuffleArray(wrongCountriesFiltered).slice(0, 3);

  // Объединяем и перемешиваем все 4 варианта
  return shuffleArray([...randomWrongAnswers, correctAnswer]);
}

export default function QuizScreen() {
  // Зафиксируем 10 случайных вопросов на всю сессию игры
  const questionsForGame = useMemo<Question[]>(() => {
    return shuffleArray(quizData.questions).slice(0, 10);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentQuestion = questionsForGame[currentIndex];

  // Генерируем варианты при смене вопроса
  useEffect(() => {
    if (currentQuestion) {
      const generated = 
        generateOptions(currentQuestion.correctAnswer, quizData.countries);

      setOptions(generated);
      setSelectedAnswer(null);
    }
  }, [currentIndex, currentQuestion]);

  if (!currentQuestion) return null;

  // Обработка выбора ответа
  const handleOptionClick = (option: string) => {
    if (selectedAnswer !== null) return; // Игнорируем повторные клики

    setSelectedAnswer(option);
    if (option === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  // Переход к следующему вопросу
  const handleNext = () => {
    if (currentIndex < questionsForGame.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Прогресс-бар / Счетчик */}
      <Text style={styles.progressText}>
        Вопрос {currentIndex + 1} из {questionsForGame.length}
      </Text>

      {/* Формулировка вопроса */}
      <Text style={styles.questionText}>{currentQuestion.question}</Text>

      {/* Флаг страны */}
      <Image
        source={{ uri: currentQuestion.flag }}
        style={styles.flagImage}
        resizeMode="contain"
      />

      {/* Сетка с 4 вариантами ответов */}
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          let buttonStyle = [styles.optionButton];
          let textStyle = [styles.optionText];

          // Логика подсветки после клика
          if (selectedAnswer !== null) {
            if (option === currentQuestion.correctAnswer) {
              buttonStyle.push(styles.correctButton);
              textStyle.push(styles.whiteText);
            } else if (option === selectedAnswer) {
              buttonStyle.push(styles.wrongButton);
              textStyle.push(styles.whiteText);
            }
          }

          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              activeOpacity={0.7}
              onPress={() => handleOptionClick(option)}
              disabled={selectedAnswer !== null}
            >
              <Text style={textStyle}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Кнопка "Дальше" появляется только после выбора ответа */}
      {selectedAnswer !== null && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === questionsForGame.length - 1 
              ? 'Завершить' 
              : 'Дальше →'
            }
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
```

---

## 🎯 Проверка Урока 2:

1. Открой приложение на телефоне через Expo Go.
2. Нажми «Начать игру» на главном экране.
3. Проверь логику:
* На кнопках рендерятся 4 уникальных названия стран (правильный ответ не дублируется в ошибочных вариантах).
* При клике на правильный вариант кнопка становится **зеленой**.
* При выборе ошибочного — кликнутая кнопка подсвечивается **красным**, а правильная параллельно окрашивается в **зеленый**.
* После клика повторно нажимать кнопки нельзя.
* Кнопка «Дальше →» появится только после того, как сделан выбор.

---

**Запуск: `npx expo start`**
