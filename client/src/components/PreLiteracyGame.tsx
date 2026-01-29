import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCreateResult } from "@/hooks/use-results";
import { Loader2, ArrowRight, CheckCircle2, XCircle, Trophy, Home, RotateCcw } from "lucide-react";

type QuestionType = 'firstLetter' | 'completeWord' | 'soundMatch' | 'initialSyllable';

interface PreLiteracyGameProps {
  questionType: QuestionType;
  onExit: () => void;
}

interface Question {
  type: QuestionType;
  prompt: string;
  image?: string;
  options: string[];
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

const words = [
  { word: 'GATO', syllables: ['GA', 'TO'], firstLetter: 'G' },
  { word: 'BOLA', syllables: ['BO', 'LA'], firstLetter: 'B' },
  { word: 'CASA', syllables: ['CA', 'SA'], firstLetter: 'C' },
  { word: 'PATO', syllables: ['PA', 'TO'], firstLetter: 'P' },
  { word: 'SAPO', syllables: ['SA', 'PO'], firstLetter: 'S' },
  { word: 'MALA', syllables: ['MA', 'LA'], firstLetter: 'M' },
  { word: 'RATO', syllables: ['RA', 'TO'], firstLetter: 'R' },
  { word: 'VACA', syllables: ['VA', 'CA'], firstLetter: 'V' },
  { word: 'FOCA', syllables: ['FO', 'CA'], firstLetter: 'F' },
  { word: 'LUVA', syllables: ['LU', 'VA'], firstLetter: 'L' },
  { word: 'DADO', syllables: ['DA', 'DO'], firstLetter: 'D' },
  { word: 'TATU', syllables: ['TA', 'TU'], firstLetter: 'T' },
  { word: 'NABO', syllables: ['NA', 'BO'], firstLetter: 'N' },
  { word: 'JACA', syllables: ['JA', 'CA'], firstLetter: 'J' },
];

const allLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'V'];
const allSyllables = ['BA', 'BO', 'CA', 'DA', 'FA', 'FO', 'GA', 'JA', 'LA', 'LU', 'MA', 'NA', 'PA', 'PO', 'RA', 'SA', 'TA', 'TU', 'VA'];

export function PreLiteracyGame({ questionType, onExit }: PreLiteracyGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [usedWordIndices, setUsedWordIndices] = useState<Set<number>>(new Set());
  
  const createResult = useCreateResult();

  const generateQuestion = (): Question => {
    const availableIndices = words.map((_, i) => i).filter(i => !usedWordIndices.has(i));
    const wordIndex = availableIndices.length > 0 
      ? availableIndices[Math.floor(Math.random() * availableIndices.length)]
      : Math.floor(Math.random() * words.length);
    
    setUsedWordIndices(prev => new Set([...Array.from(prev), wordIndex]));
    const wordData = words[wordIndex];
    
    switch (questionType) {
      case 'firstLetter': {
        const wrongOptions = allLetters.filter(l => l !== wordData.firstLetter).sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [wordData.firstLetter, ...wrongOptions].sort(() => Math.random() - 0.5);
        return {
          type: 'firstLetter',
          prompt: `Qual é a primeira letra de "${wordData.word}"?`,
          options,
          correctAnswer: wordData.firstLetter,
        };
      }
      case 'completeWord': {
        const missing = wordData.word.slice(1);
        const wrongOptions = words.filter(w => w.word !== wordData.word).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.word.slice(1));
        const options = [missing, ...wrongOptions].sort(() => Math.random() - 0.5);
        return {
          type: 'completeWord',
          prompt: `Complete: ${wordData.firstLetter}___`,
          options,
          correctAnswer: missing,
        };
      }
      case 'soundMatch': {
        const sameStart = words.filter(w => w.firstLetter === wordData.firstLetter && w.word !== wordData.word);
        const correctWord = sameStart.length > 0 ? sameStart[0].word : wordData.word;
        const wrongOptions = words.filter(w => w.firstLetter !== wordData.firstLetter).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.word);
        const options = [correctWord, ...wrongOptions].sort(() => Math.random() - 0.5);
        return {
          type: 'soundMatch',
          prompt: `Qual palavra começa com o som "${wordData.firstLetter}"?`,
          options,
          correctAnswer: correctWord,
        };
      }
      case 'initialSyllable': {
        const wrongOptions = allSyllables.filter(s => s !== wordData.syllables[0]).sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [wordData.syllables[0], ...wrongOptions].sort(() => Math.random() - 0.5);
        return {
          type: 'initialSyllable',
          prompt: `Qual é a sílaba inicial de "${wordData.word}"?`,
          options,
          correctAnswer: wordData.syllables[0],
        };
      }
    }
  };

  useEffect(() => {
    setCurrentQuestion(generateQuestion());
  }, []);

  const handleAnswer = (answer: string) => {
    if (feedback !== null) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion?.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setSelectedAnswer(null);
    
    if (currentQuestionIndex + 1 >= TOTAL_QUESTIONS) {
      finishGame();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentQuestion(generateQuestion());
    }
  };

  const finishGame = () => {
    setIsGameFinished(true);
    if (score >= 7) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    createResult.mutate({
      subject: 'preLiteracy',
      topic: questionType,
      score: score,
      totalQuestions: TOTAL_QUESTIONS
    });
  };

  if (isGameFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
        >
          <Trophy className="w-16 h-16 text-white" />
        </motion.div>
        
        <h2 className="text-4xl font-bold">Fim de Jogo!</h2>
        <p className="text-xl text-muted-foreground">Sua pontuação</p>
        <div className="text-6xl font-black text-yellow-500">{score}/{TOTAL_QUESTIONS}</div>
        <p className="text-lg text-muted-foreground">
          {score === 10 ? "Perfeito! Você é incrível!" : score >= 7 ? "Muito bem! Continue assim!" : "Bom treino! Tente novamente!"}
        </p>

        <div className="flex gap-4">
          <Button onClick={onExit} variant="outline" size="lg" className="rounded-full px-8">
            <Home className="mr-2 w-5 h-5" /> Menu
          </Button>
          <Button onClick={() => window.location.reload()} size="lg" className="rounded-full px-8 bg-yellow-500 hover:bg-yellow-600">
            <RotateCcw className="mr-2 w-5 h-5" /> Jogar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-yellow-500"/></div>;

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onExit}>
          <Home className="w-4 h-4 mr-2" /> Sair
        </Button>
        <div className="text-right">
          <span className="text-sm font-bold text-muted-foreground">Pergunta {currentQuestionIndex + 1} de {TOTAL_QUESTIONS}</span>
          <br />
          <span className="text-xs text-muted-foreground">Pontuação: {score}</span>
        </div>
      </div>

      <Progress value={(currentQuestionIndex / TOTAL_QUESTIONS) * 100} className="h-3 mb-8" />

      <Card className="border-0 shadow-2xl bg-white/50 backdrop-blur-xl p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{currentQuestion.prompt}</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={feedback !== null}
                  className={`p-6 text-2xl font-bold rounded-2xl border-2 transition-all ${
                    feedback !== null
                      ? option === currentQuestion.correctAnswer
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : selectedAnswer === option
                          ? 'bg-red-100 border-red-500 text-red-700'
                          : 'bg-gray-100 border-gray-200 text-gray-400'
                      : 'bg-white border-border hover:border-yellow-500 hover:bg-yellow-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
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
                  <p className="text-lg text-red-600 mb-4">
                    A resposta correta é: <span className="font-bold">{currentQuestion.correctAnswer}</span>
                  </p>
                )}

                <Button onClick={handleNext} className="bg-yellow-500 hover:bg-yellow-600">
                  Próxima Pergunta <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
