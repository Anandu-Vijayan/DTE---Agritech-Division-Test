"use client"

import { useState } from "react"
import { Pencil, Trash2, Plus, Minus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuestions } from "@/hooks/use-questions"
import type { Question, QuestionFormData } from "@/types/questions"

interface QuestionEditorProps {
  questionId?: string
  onSave?: () => void
  onCancel?: () => void
}

export function QuestionEditor({ questionId, onSave, onCancel }: QuestionEditorProps) {
  const { questions, addQuestion, updateQuestion } = useQuestions()
  const existingQuestion = questionId ? questions.find((q) => q.id === questionId) : null

  const [formData, setFormData] = useState<QuestionFormData>(() => ({
    text: existingQuestion?.text ?? "",
    type: existingQuestion?.type ?? "radio",
    isLinked: existingQuestion?.isLinked ?? false,
    options: existingQuestion?.options ?? [
      { id: "1", text: "Lorem Ipsum is simply dum..." },
      { id: "2", text: "Lorem Ipsum is simply dum..." },
      { id: "3", text: "Lorem Ipsum is simply dum..." },
    ],
    onlyDefault: existingQuestion?.onlyDefault ?? false,
    defaultOption: existingQuestion?.defaultOption,
    answered: existingQuestion?.answered ?? false
  }))

  const handleSave = () => {
    if (questionId) {
      updateQuestion(questionId, formData)
    } else {
      addQuestion(formData)
    }
    onSave?.()
  }

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { id: String(prev.options.length + 1), text: "Lorem Ipsum is simply dum..." }],
    }))
  }

  const removeOption = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.id !== id),
    }))
  }

  const updateOptionText = (id: string, text: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt) => (opt.id === id ? { ...opt, text } : opt)),
    }))
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">Questions</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <span className="text-sm mt-2">{existingQuestion?.order ?? questions.length + 1}</span>
          <div className="flex-1 space-y-4">
            <Input
              value={formData.text}
              onChange={(e) => setFormData((prev) => ({ ...prev, text: e.target.value }))}
              className="text-lg font-medium"
              placeholder="Enter question text"
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Question Type</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isLinked}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isLinked: checked }))}
                  />
                  <span className="text-sm text-blue-500">Linked Question</span>
                </div>
              </div>

              <Select
                value={formData.type}
                onValueChange={(value: Question["type"]) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radio">Radio Button</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="text">Text Input</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type !== "text" && (
              <div className="space-y-3">
                {formData.options.map((option) => (
                  <div key={option.id} className="flex items-center gap-3">
                    <Input
                      value={option.text}
                      onChange={(e) => updateOptionText(option.id, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-red-50 hover:bg-red-100"
                      onClick={() => removeOption(option.id)}
                    >
                      <Minus className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}

                <Button variant="ghost" className="text-blue-500" onClick={addOption}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            )}

            {formData.type !== "text" && (
              <div className="pt-4">
                <Tabs
                  value={formData.defaultOption ?? formData.options[0]?.id}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, defaultOption: value }))}
                >
                  <div className="flex justify-between items-center">
                    <TabsList>
                      {formData.options.map((option, index) => (
                        <TabsTrigger key={option.id} value={option.id} className={index === 0 ? "text-blue-500" : ""}>
                          Option {index + 1}
                        </TabsTrigger>
                      ))}
                      <TabsTrigger value="default">Default</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.onlyDefault}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, onlyDefault: checked }))}
                      />
                      <span className="text-sm">Only Default</span>
                    </div>
                  </div>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

