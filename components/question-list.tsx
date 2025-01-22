"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Pencil, Trash2, Plus, Grid, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuestions } from "@/hooks/use-questions";
import { QuestionEditor } from "./question-editor";
import { QuestionAnswering } from "./question-answering";

interface Question {
  id: string;
  order: number;
  text: string;
  isLinked?: boolean;
  answered?: boolean;
}

export function QuestionList() {
  const { questions, deleteQuestion, reorderQuestions } = useQuestions((state) => ({
    questions: state.questions,
    deleteQuestion: state.deleteQuestion,
    reorderQuestions: state.reorderQuestions,
  }));
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderQuestions(result.source.index, result.destination.index);
  };

  if (editingId || isAdding) {
    return (
      <QuestionEditor
        questionId={editingId ?? undefined}
        onSave={() => {
          setEditingId(null);
          setIsAdding(false);
        }}
        onCancel={() => {
          setEditingId(null);
          setIsAdding(false);
        }}
      />
    );
  }

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-xl font-medium">Questions</h1>
        <Badge variant="secondary" className="bg-gray-100">
          Recurring
          <span className="text-xs text-gray-500 ml-2">Min 1 | Max 5</span>
        </Badge>
        <Button variant="ghost" className="text-blue-500 ml-auto">
          Time Bound
        </Button>
      </div>

      <div className="flex gap-6">
        <div className="w-1/2">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {questions.map((question, index) => (
                    <Draggable key={question.id} draggableId={question.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex items-center gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer ${
                            selectedQuestionId === question.id ? "ring-2 ring-blue-500" : ""
                          }`}
                          onClick={() => setSelectedQuestionId(question.id)}
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Grid className="h-4 w-4" />
                          </Button>
                          <span>{question.order}.</span>
                          <span className="flex-1">{question.text}</span>
                          {question.isLinked && (
                            <Badge variant="secondary" className="bg-blue-50 text-blue-500">
                              Linked Question
                            </Badge>
                          )}
                          {question.answered && (
                            <Badge variant="secondary" className="bg-green-50 text-green-500">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Answered
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(question.id);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteQuestion(question.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button variant="ghost" className="text-blue-500 mt-4" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Next Question
          </Button>
        </div>

        <div className="w-1/2">
          {selectedQuestion ? (
            <QuestionAnswering question={selectedQuestion} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a question to view and answer
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
