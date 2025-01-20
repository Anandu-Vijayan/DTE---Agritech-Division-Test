export interface Option {
    id: string
    text: string
  }
  
  export interface Question {
    id: string
    order: number
    text: string
    type: "radio" | "checkbox" | "text"
    isLinked: boolean
    options: Option[]
    defaultOption?: string
    onlyDefault: boolean
    answered: boolean
  }
  
  export type QuestionFormData = Omit<Question, "id" | "order">
  
  