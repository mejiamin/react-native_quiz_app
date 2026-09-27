export interface Question {
  question: string
  correctAnswer: string
  flag: string
}

export interface QuisData {
  qustions: Question[]
  countries: string[]
}

export type RootStackParamList = {
  Welcome: undefined
  Quiz: undefined
}
