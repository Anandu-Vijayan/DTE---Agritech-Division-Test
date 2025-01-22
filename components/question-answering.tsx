"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useQuestions } from "@/hooks/use-questions"
import type { Question } from "@/types/questions"

interface QuestionAnsweringProps {
  question: Question
}

export function QuestionAnswering({ question }: QuestionAnsweringProps) {
  const { markQuestionAnswered } = useQuestions()
  const [answer, setAnswer] = useState<string | string[]>("")

  const handleSubmit = () => {
    if (answer) {
      markQuestionAnswered(question.id)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{question.text}</h2>
      {question.type === "radio" && (
        <RadioGroup onValueChange={(value) => setAnswer(value)}>
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id}>{option.text}</Label>
            </div>
          ))}
        </RadioGroup>
      )}
      {question.type === "checkbox" && (
        <div className="space-y-2">
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                onCheckedChange={(checked) => {
                  setAnswer((prev) => {
                    const prevArray = Array.isArray(prev) ? prev : []
                    if (checked) {
                      return [...prevArray, option.id]
                    } else {
                      return prevArray.filter((id) => id !== option.id)
                    }
                  })
                }}
              />
              <Label htmlFor={option.id}>{option.text}</Label>
            </div>
          ))}
        </div>
      )}
      {question.type === "text" && (
        <div className="space-y-2">
          <Label htmlFor="answer">Your answer</Label>
          <Input id="answer" placeholder="Type your answer here" onChange={(e) => setAnswer(e.target.value)} />
        </div>
      )}
      <Button className="mt-4" onClick={handleSubmit}>
        Submit Answer
      </Button>
    </div>
  )
}

