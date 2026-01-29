import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useCreateResult } from "@/hooks/use-results";
import { Loader2, ArrowRight, CheckCircle2, XCircle, Trophy, Home, RotateCcw } from "lucide-react";

type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

interface MathGameProps {
  operation: Operation;
  onExit: () => void;
}

interface Question {
  num1: number;
  num2: number;
  answer: number;
  operator: string;
}

const TOTAL_QUESTIONS = 10;

export function MathGame({ operation, onExit }: MathGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  
  const createResult = useCreateResult();

  const generateQuestion = (): Question => {
    let num1 = 0, num2 = 0, answer = 0, operator = "+";
    let questionKey = "";
    let attempts = 0;
    const maxAttempts = 100;

    do {
      switch (operation) {
        case 'addition':
          num1 = Math.floor(Math.random() * 10);
          num2 = Math.floor(Math.random() * 10);
          answer = num1 + num2;
          operator = "+";
          break;
        case 'subtraction':
          num1 = Math.floor(Math.random() * 10);
          num2 = Math.floor(Math.random() * (num1 + 1));
          answer = num1 - num2;
          operator = "-";
          break;
        case 'multiplication':
          num1 = Math.floor(Math.random() * 10);
          num2 = Math.floor(Math.random() * 10);
          answer = num1 * num2;
          operator = "×";
          break;
        case 'division':
          num2 = Math.floor(Math.random() * 9) + 1;
          answer = Math.floor(Math.random() * 10);
          num1 = num2 * answer;
          operator = "÷";
          break;
      }
      questionKey = `${num1}${operator}${num2}`;
      attempts++;
    } while (usedQuestions.has(questionKey) && attempts < maxAttempts);

    setUsedQuestions(prev => new Set([...Array.from(prev), questionKey]));
    return { num1, num2, answer, operator };
  };

  useEffect(() => {
    setCurrentQuestion(generateQuestion());
  }, []);

  useEffect(() => {
    if (feedback === null && !isGameFinished) {
      inputRef.current?.focus();
    }
  }, [feedback, currentQuestion, isGameFinished]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentQuestion || !userAnswer) return;

    const numAnswer = parseInt(userAnswer, 10);
    const isCorrect = numAnswer === currentQuestion.answer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setUserAnswer("");
    
    if (currentQuestionIndex + 1 >= TOTAL_QUESTIONS) {
      finishGame();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentQuestion(generateQuestion());
    }
  };

  const finishGame = () => {
    setIsGameFinished(true);
    // Optimistic update isn't strictly necessary here, just fire and forget or handle error if needed
    // But we are in a component that might unmount if user clicks 'Home' too fast, 
    // so we trigger it immediately.
    const finalScore = feedback === 'correct' ? score + 1 : score; // Account for the last question update being async state
    // Actually, react state update batching might be tricky. Let's use a local variable for final score calculation to be safe
    // Wait... setScore happened before setFeedback. 
    // If I call finishGame inside handleNext, the score is already updated.
    // The only edge case is if the LAST question was correct, score is updated, then we call finishGame.
    // However, handleNext is called via button click.
    
    // Let's rely on current score state which should be updated.
    // Trigger confetti if good score
    if (score >= 7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    createResult.mutate({
      subject: 'math',
      topic: operation,
      score: score,
      totalQuestions: TOTAL_QUESTIONS
    });
  };

  if (isGameFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6"
          >
            <Trophy className="w-16 h-16 text-white drop-shadow-md" />
          </motion.div>
          
          <h2 className="text-4xl font-bold text-foreground mb-2">Fim de Jogo!</h2>
          <p className="text-xl text-muted-foreground">Sua pontuação</p>
          <div className="text-6xl font-black text-primary my-4 tracking-tighter">
            {score}/{TOTAL_QUESTIONS}
          </div>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            {score === 10 ? "Pontuação perfeita! Você é um mago da matemática! 🧙‍♂️" : 
             score >= 7 ? "Trabalho incrível! Continue assim! 🌟" : 
             "Bom treino! Tente novamente para melhorar! 💪"}
          </p>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={onExit}
            variant="outline"
            size="lg"
            className="rounded-full px-8 border-2 hover:bg-muted/50 text-lg h-14"
          >
            <Home className="mr-2 w-5 h-5" /> Menu
          </Button>
          <Button 
            onClick={() => window.location.reload()} // Simple reload to restart effectively
            size="lg"
            className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 text-lg h-14"
          >
            <RotateCcw className="mr-2 w-5 h-5" /> Jogar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-primary"/></div>;

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onExit} className="text-muted-foreground hover:text-foreground">
          <Home className="w-4 h-4 mr-2" /> Sair
        </Button>
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Pergunta {currentQuestionIndex + 1} de {TOTAL_QUESTIONS}</span>
          <span className="text-xs text-muted-foreground font-medium">Pontuação: {score}</span>
        </div>
      </div>

      <Progress value={((currentQuestionIndex) / TOTAL_QUESTIONS) * 100} className="h-3 mb-8 rounded-full bg-muted" />

      <Card className="border-0 shadow-2xl bg-white/50 backdrop-blur-xl overflow-hidden relative">
        <div className="p-8 md:p-12 text-center relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <div className="text-7xl md:text-9xl font-black text-foreground tracking-tight flex items-center justify-center gap-4 md:gap-8 font-display">
                <span>{currentQuestion.num1}</span>
                <span className="text-primary">{currentQuestion.operator}</span>
                <span>{currentQuestion.num2}</span>
                <span className="text-muted-foreground">=</span>
                <span className="text-primary">?</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="max-w-xs mx-auto space-y-6">
            {!feedback ? (
              <>
                <Input
                  ref={inputRef}
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="?"
                  className="text-center text-4xl h-20 rounded-2xl border-2 focus:ring-4 focus:ring-primary/20 bg-white shadow-inner font-bold font-display"
                  autoFocus
                />
                <Button 
                  type="submit" 
                  disabled={!userAnswer}
                  className="w-full h-14 text-lg rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all"
                >
                  Verificar Resposta
                </Button>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-6 rounded-2xl ${feedback === 'correct' ? 'bg-green-100/50 border-2 border-green-200' : 'bg-red-100/50 border-2 border-red-200'}`}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  {feedback === 'correct' ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600" />
                  )}
                  <span className={`text-2xl font-bold ${feedback === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                    {feedback === 'correct' ? "Correto!" : "Ops!"}
                  </span>
                </div>
                
                {feedback === 'wrong' && (
                  <p className="text-lg text-red-600 mb-4 font-medium">
                    A resposta correta é <span className="font-bold text-xl">{currentQuestion.answer}</span>
                  </p>
                )}

                <Button 
                  onClick={handleNext} 
                  autoFocus
                  className={`w-full h-14 text-lg rounded-xl font-bold shadow-lg transition-all ${
                    feedback === 'correct' 
                      ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' 
                      : 'bg-primary hover:bg-primary/90 shadow-primary/20'
                  }`}
                >
                  Próxima Pergunta <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </form>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
      </Card>
    </div>
  );
}
