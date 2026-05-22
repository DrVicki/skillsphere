import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ClipboardList, RotateCcw, Trophy } from "lucide-react";

interface Question {
  id: string | number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface AssessmentData {
  questions: Question[];
  passingScore?: number; // percentage 0-100, default 70
  title?: string;
}

interface Props {
  moduleId: number;
  courseId: number;
  assessmentData: AssessmentData;
  isCompleted: boolean;
  onComplete: (score: number, passed: boolean) => void;
}

export default function AssessmentViewer({ assessmentData, isCompleted, onComplete }: Props) {
  const questions = assessmentData?.questions ?? [];
  const passingScore = assessmentData?.passingScore ?? 70;
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);

  if (!questions.length) {
    return (
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList className="h-5 w-5 text-purple-500" />
          <h3 className="font-semibold">Assessment</h3>
        </div>
        <p className="text-muted-foreground text-sm">No questions available for this assessment.</p>
      </div>
    );
  }

  const correctCount = submitted
    ? questions.filter((q, i) => answers[i] === q.correctIndex).length
    : 0;
  const scorePercent = submitted ? Math.round((correctCount / questions.length) * 100) : 0;
  const passed = scorePercent >= passingScore;

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) return;
    setSubmitted(true);
    onComplete(scorePercent, passed);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setCurrentQ(0);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl border border-border p-6 space-y-6">
        {/* Score Summary */}
        <div className={`rounded-xl p-6 text-center ${passed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${passed ? "bg-green-100" : "bg-red-100"}`}>
            {passed ? <Trophy className="h-8 w-8 text-green-600" /> : <XCircle className="h-8 w-8 text-red-500" />}
          </div>
          <h3 className={`text-xl font-bold mb-1 ${passed ? "text-green-700" : "text-red-600"}`}>
            {passed ? "Assessment Passed!" : "Not Passed"}
          </h3>
          <p className={`text-sm mb-3 ${passed ? "text-green-600" : "text-red-500"}`}>
            {passed ? "Great work! You've successfully completed this assessment." : `You need ${passingScore}% to pass. Try again!`}
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{scorePercent}%</p>
              <p className="text-xs text-muted-foreground">Your Score</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{correctCount}/{questions.length}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{passingScore}%</p>
              <p className="text-xs text-muted-foreground">Passing Score</p>
            </div>
          </div>
          <Progress value={scorePercent} className="mt-4 h-2" />
        </div>

        {/* Answer Review */}
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">Answer Review</h4>
          <div className="space-y-4">
            {questions.map((q, qi) => {
              const userAnswer = answers[qi];
              const isCorrect = userAnswer === q.correctIndex;
              return (
                <div key={qi} className={`rounded-lg border p-4 ${isCorrect ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}>
                  <div className="flex items-start gap-2 mb-3">
                    {isCorrect
                      ? <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      : <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />}
                    <p className="text-sm font-medium text-foreground">{qi + 1}. {q.question}</p>
                  </div>
                  <div className="ml-6 space-y-1">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className={`text-xs px-3 py-1.5 rounded-md ${
                        oi === q.correctIndex ? "bg-green-100 text-green-700 font-medium" :
                        oi === userAnswer && !isCorrect ? "bg-red-100 text-red-600 line-through" :
                        "text-muted-foreground"
                      }`}>
                        {oi === q.correctIndex && "✓ "}{opt}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <p className="ml-6 mt-2 text-xs text-muted-foreground italic">{q.explanation}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {!passed && (
          <Button variant="outline" onClick={handleRetry} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" /> Retry Assessment
          </Button>
        )}
      </div>
    );
  }

  const q = questions[currentQ];
  const progress = ((currentQ) / questions.length) * 100;

  return (
    <div className="bg-white rounded-xl border border-border p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-purple-500" />
          <h3 className="font-semibold">{assessmentData.title ?? "Assessment"}</h3>
        </div>
        <Badge variant="outline" className="text-xs">{currentQ + 1} / {questions.length}</Badge>
      </div>
      <Progress value={progress} className="h-1.5" />

      {/* Question */}
      <div>
        <p className="font-medium text-foreground mb-4">{currentQ + 1}. {q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, oi) => (
            <button
              key={oi}
              onClick={() => setAnswers({ ...answers, [currentQ]: oi })}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                answers[currentQ] === oi
                  ? "border-primary bg-primary/5 text-primary font-medium"
                  : "border-border hover:border-primary/50 hover:bg-gray-50 text-foreground"
              }`}
            >
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs mr-2 font-medium ${
                answers[currentQ] === oi ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {String.fromCharCode(65 + oi)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" size="sm" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}>
          ← Previous
        </Button>
        <div className="flex gap-1">
          {questions.map((_, qi) => (
            <button
              key={qi}
              onClick={() => setCurrentQ(qi)}
              className={`w-2 h-2 rounded-full transition-colors ${
                qi === currentQ ? "bg-primary" :
                answers[qi] !== undefined ? "bg-primary/40" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        {currentQ < questions.length - 1 ? (
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white" onClick={() => setCurrentQ(currentQ + 1)} disabled={answers[currentQ] === undefined}>
            Next →
          </Button>
        ) : (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
          >
            Submit Assessment
          </Button>
        )}
      </div>

      {Object.keys(answers).length < questions.length && currentQ === questions.length - 1 && (
        <p className="text-xs text-muted-foreground text-center">
          Answer all {questions.length} questions to submit ({Object.keys(answers).length}/{questions.length} answered)
        </p>
      )}
    </div>
  );
}
