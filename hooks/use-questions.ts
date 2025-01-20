"use client"

import { create } from "zustand"
import { generateId } from "@/lib/utils"
import type { Question, QuestionFormData } from "@/types/questions"

interface QuestionStore {
  questions: Question[]
  addQuestion: (data: QuestionFormData) => void
  updateQuestion: (id: string, data: Partial<Question>) => void
  deleteQuestion: (id: string) => void
  reorderQuestions: (startIndex: number, endIndex: number) => void
  markQuestionAnswered: (id: string) => void
}

export const useQuestions = create<QuestionStore>((set) => ({
  questions: [
    {
      id: "1",
      order: 1,
      text: "Is soil sample analysis done for the farm ?",
      type: "radio",
      isLinked: true,
      options: [
        { id: "1", text: "Lorem Ipsum is simply dum..." },
        { id: "2", text: "Lorem Ipsum is simply dum..." },
        { id: "3", text: "Lorem Ipsum is simply dum..." },
      ],
      onlyDefault: false,
      answered: false,
    },
    {
      id: "2",
      order: 2,
      text: "Is soil sample analysis done for the farm ?",
      type: "radio",
      isLinked: false,
      options: [
        { id: "1", text: "Lorem Ipsum is simply dum..." },
        { id: "2", text: "Lorem Ipsum is simply dum..." },
        { id: "3", text: "Lorem Ipsum is simply dum..." },
      ],
      onlyDefault: false,
      answered: false,
    },
  ],
  addQuestion: (data) =>
    set((state) => ({
      questions: [
        ...state.questions,
        {
          ...data,
          id: generateId(),
          order: state.questions.length + 1,
        },
      ],
    })),
  updateQuestion: (id, data) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === id ? { ...q, ...data } : q)),
    })),
  deleteQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id).map((q, i) => ({ ...q, order: i + 1 })),
    })),
  reorderQuestions: (startIndex, endIndex) =>
    set((state) => {
      const newQuestions = [...state.questions]
      const [removed] = newQuestions.splice(startIndex, 1)
      newQuestions.splice(endIndex, 0, removed)
      return {
        questions: newQuestions.map((q, i) => ({ ...q, order: i + 1 })),
      }
    }),
  markQuestionAnswered: (id) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === id ? { ...q, answered: true } : q)),
    })),
}))

