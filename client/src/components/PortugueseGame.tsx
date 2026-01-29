import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCreateResult } from "@/hooks/use-results";
import { Loader2, ArrowRight, CheckCircle2, XCircle, Trophy, Home, RotateCcw, Check, X } from "lucide-react";

type Topic = 'grammar' | 'spelling' | 'agreement' | 'semantics' | 'punctuation' | 'random';

interface PortugueseGameProps {
  topic: Topic;
  onExit: () => void;
}

interface Question {
  sentence: string;
  isCorrect: boolean;
  correction: string;
  category: string;
}

const TOTAL_QUESTIONS = 10;

const questions: Question[] = [
  { sentence: "Fazem dois anos que não o vejo.", isCorrect: false, correction: "Faz dois anos que não o vejo.", category: "grammar" },
  { sentence: "Houveram muitos acidentes ontem.", isCorrect: false, correction: "Houve muitos acidentes ontem.", category: "grammar" },
  { sentence: "Ela está meia cansada hoje.", isCorrect: false, correction: "Ela está meio cansada hoje.", category: "grammar" },
  { sentence: "Nós assistimos o filme ontem.", isCorrect: false, correction: "Nós assistimos ao filme ontem.", category: "grammar" },
  { sentence: "Ele chegou atrasado na reunião.", isCorrect: true, correction: "", category: "grammar" },
  
  { sentence: "Ele foi a passeio no parque.", isCorrect: false, correction: "Ele foi passear no parque.", category: "spelling" },
  { sentence: "A exceção confirma a regra.", isCorrect: true, correction: "", category: "spelling" },
  { sentence: "Ela quiz ir embora cedo.", isCorrect: false, correction: "Ela quis ir embora cedo.", category: "spelling" },
  { sentence: "Vou analizar o documento.", isCorrect: false, correction: "Vou analisar o documento.", category: "spelling" },
  { sentence: "Ele tem previlégio especial.", isCorrect: false, correction: "Ele tem privilégio especial.", category: "spelling" },
  
  { sentence: "Os alunos estava cansados.", isCorrect: false, correction: "Os alunos estavam cansados.", category: "agreement" },
  { sentence: "Fazem-se reformas aqui.", isCorrect: false, correction: "Fazem-se reformas aqui. (ou Faz-se reforma)", category: "agreement" },
  { sentence: "A maioria dos alunos faltou.", isCorrect: true, correction: "", category: "agreement" },
  { sentence: "Haviam pessoas na fila.", isCorrect: false, correction: "Havia pessoas na fila.", category: "agreement" },
  { sentence: "As crianças brincavam felizes.", isCorrect: true, correction: "", category: "agreement" },
  
  { sentence: "Ele é um homem de bom coração.", isCorrect: true, correction: "", category: "semantics" },
  { sentence: "A festa foi muito mais melhor.", isCorrect: false, correction: "A festa foi muito melhor.", category: "semantics" },
  { sentence: "Subir para cima é redundante.", isCorrect: true, correction: "", category: "semantics" },
  { sentence: "Ele entrou para dentro da sala.", isCorrect: false, correction: "Ele entrou na sala.", category: "semantics" },
  { sentence: "A menina ganhou um presente.", isCorrect: true, correction: "", category: "semantics" },
  
  { sentence: "João disse eu vou sair.", isCorrect: false, correction: "João disse: \"Eu vou sair.\"", category: "punctuation" },
  { sentence: "Maria, a professora, chegou.", isCorrect: true, correction: "", category: "punctuation" },
  { sentence: "Comprei: maçãs laranjas e bananas.", isCorrect: false, correction: "Comprei maçãs, laranjas e bananas.", category: "punctuation" },
  { sentence: "Ele perguntou, onde você vai?", isCorrect: false, correction: "Ele perguntou: \"Onde você vai?\"", category: "punctuation" },
  { sentence: "O menino, que corria, caiu.", isCorrect: true, correction: "", category: "punctuation" },
];

export function PortugueseGame({ topic, onExit }: PortugueseGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set());
  
  const createResult = useCreateResult();

  const generateQuestion = (): Question => {
    const filtered = topic === 'random' 
      ? questions 
      : questions.filter(q => q.category === topic);
    
    const available = filtered.filter((_, i) => !usedQuestions.has(i));
    const pool = available.length > 0 ? available : filtered;
    
    const randomIndex = Math.floor(Math.random() * pool.length);
    const question = pool[randomIndex];
    
    const originalIndex = questions.indexOf(question);
    setUsedQuestions(prev => new Set([...Array.from(prev), originalIndex]));
    
    return question;
  };

  useEffect(() => {
    setCurrentQuestion(generateQuestion());
  }, []);

  const handleAnswer = (answer: boolean) => {
    if (feedback !== null) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion?.isCorrect;
    
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
      subject: 'portuguese',
      topic: topic,
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
          className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Trophy className="w-16 h-16 text-white" />
        </motion.div>
        
        <h2 className="text-4xl font-bold">Fim de Jogo!</h2>
        <p className="text-xl text-muted-foreground">Sua pontuação</p>
        <div className="text-6xl font-black text-green-500">{score}/{TOTAL_QUESTIONS}</div>

        <div className="flex gap-4">
          <Button onClick={onExit} variant="outline" size="lg" className="rounded-full px-8">
            <Home className="mr-2 w-5 h-5" /> Menu
          </Button>
          <Button onClick={() => window.location.reload()} size="lg" className="rounded-full px-8 bg-green-500 hover:bg-green-600">
            <RotateCcw className="mr-2 w-5 h-5" /> Jogar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-green-500"/></div>;

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
            <p className="text-sm text-muted-foreground text-center mb-4">Esta frase está correta ou incorreta?</p>
            
            <div className="bg-white p-6 rounded-2xl border-2 border-border mb-8">
              <p className="text-xl md:text-2xl font-medium text-center">
                "{currentQuestion.sentence}"
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                disabled={feedback !== null}
                className={`p-6 text-xl font-bold rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${
                  feedback !== null
                    ? currentQuestion.isCorrect
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : selectedAnswer === true
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-100 border-gray-200 text-gray-400'
                    : 'bg-white border-border hover:border-green-500 hover:bg-green-50'
                }`}
              >
                <Check className="w-6 h-6" /> Certo
              </button>
              <button
                onClick={() => handleAnswer(false)}
                disabled={feedback !== null}
                className={`p-6 text-xl font-bold rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${
                  feedback !== null
                    ? !currentQuestion.isCorrect
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : selectedAnswer === false
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-100 border-gray-200 text-gray-400'
                    : 'bg-white border-border hover:border-red-500 hover:bg-red-50'
                }`}
              >
                <X className="w-6 h-6" /> Errado
              </button>
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
                
                {!currentQuestion.isCorrect && currentQuestion.correction && (
                  <p className="text-lg text-muted-foreground mb-4">
                    Correção: <span className="font-bold text-foreground">"{currentQuestion.correction}"</span>
                  </p>
                )}

                <Button onClick={handleNext} className="bg-green-500 hover:bg-green-600">
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
