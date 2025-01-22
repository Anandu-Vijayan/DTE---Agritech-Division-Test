"use client";

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!answer || (Array.isArray(answer) && answer.length === 0)) {
      setError("Please provide an answer")
      return
    }

    try {
      setIsSubmitting(true)
      await markQuestionAnswered(question.id)
    } catch (err) {
      setError("Failed to submit answer")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">{question.text}</h2>
      
      {question.type === "radio" && (
        <RadioGroup 
          onValueChange={(value) => setAnswer(value)}
          name="radio-answer"
          aria-label={question.text}
        >
          {question.options?.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id}>{option.text}</Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {question.type === "checkbox" && (
        <div className="space-y-2" role="group" aria-label={question.text}>
          {question.options?.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                name="checkbox-answer"
                onCheckedChange={(checked) => {
                  setAnswer((prev) => {
                    const prevArray = Array.isArray(prev) ? prev : []
                    if (checked) {
                      return [...prevArray, option.id]
                    }
                    return prevArray.filter((id) => id !== option.id)
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
          <Label htmlFor="text-answer">Your answer</Label>
          <Input 
            id="text-answer"
            name="text-answer"
            placeholder="Type your answer here"
            onChange={(e) => setAnswer(e.target.value)}
            value={typeof answer === 'string' ? answer : ''}
            aria-invalid={!!error}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500" role="alert">{error}</p>
      )}

      <Button 
        type="submit" 
        className="mt-4"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Answer"}
      </Button>
    </form>
  )
}