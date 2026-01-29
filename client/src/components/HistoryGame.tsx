import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCreateResult } from "@/hooks/use-results";
import { Loader2, ArrowRight, CheckCircle2, XCircle, Trophy, Home, RotateCcw, Check, X } from "lucide-react";

type Topic = 'brazil' | 'world' | 'dates' | 'random';

interface HistoryGameProps {
  topic: Topic;
  onExit: () => void;
}

interface Question {
  statement: string;
  isCorrect: boolean;
  explanation: string;
  category: string;
}

const TOTAL_QUESTIONS = 10;

const questions: Question[] = [
  { statement: "O Brasil foi descoberto por Pedro Álvares Cabral em 1500.", isCorrect: true, explanation: "Pedro Álvares Cabral chegou ao Brasil em 22 de abril de 1500.", category: "brazil" },
  { statement: "A Independência do Brasil ocorreu em 7 de setembro de 1822.", isCorrect: true, explanation: "Dom Pedro I proclamou a independência às margens do rio Ipiranga.", category: "brazil" },
  { statement: "O Brasil foi uma monarquia durante todo o século XIX.", isCorrect: false, explanation: "O Brasil se tornou República em 15 de novembro de 1889.", category: "brazil" },
  { statement: "A escravidão foi abolida no Brasil em 1888 com a Lei Áurea.", isCorrect: true, explanation: "A Princesa Isabel assinou a Lei Áurea em 13 de maio de 1888.", category: "brazil" },
  { statement: "Getúlio Vargas governou o Brasil por 15 anos consecutivos.", isCorrect: true, explanation: "Vargas governou de 1930 a 1945, um total de 15 anos.", category: "brazil" },
  { statement: "A ditadura militar no Brasil durou de 1964 a 1985.", isCorrect: true, explanation: "O regime militar começou com o golpe de 1964 e terminou em 1985.", category: "brazil" },
  { statement: "Brasília foi inaugurada como capital em 1950.", isCorrect: false, explanation: "Brasília foi inaugurada em 21 de abril de 1960 por JK.", category: "brazil" },
  
  { statement: "As Pirâmides do Egito foram construídas pelos romanos.", isCorrect: false, explanation: "As pirâmides foram construídas pelos egípcios há mais de 4.500 anos.", category: "world" },
  { statement: "A Revolução Francesa começou em 1789.", isCorrect: true, explanation: "A queda da Bastilha em 14 de julho de 1789 marca o início.", category: "world" },
  { statement: "A Primeira Guerra Mundial começou em 1914.", isCorrect: true, explanation: "A guerra começou em 1914 após o assassinato de Franz Ferdinand.", category: "world" },
  { statement: "A Segunda Guerra Mundial terminou em 1945.", isCorrect: true, explanation: "A guerra terminou com a rendição do Japão em setembro de 1945.", category: "world" },
  { statement: "O Império Romano caiu no ano 476 d.C.", isCorrect: true, explanation: "O Império Romano do Ocidente caiu em 476 d.C.", category: "world" },
  { statement: "A Guerra Fria foi um conflito armado direto entre EUA e URSS.", isCorrect: false, explanation: "A Guerra Fria foi um conflito ideológico sem confronto direto.", category: "world" },
  { statement: "Cristóvão Colombo chegou à América em 1492.", isCorrect: true, explanation: "Colombo chegou às Américas em 12 de outubro de 1492.", category: "world" },
  { statement: "A Revolução Industrial começou na França.", isCorrect: false, explanation: "A Revolução Industrial começou na Inglaterra no século XVIII.", category: "world" },
  
  { statement: "A queda do Muro de Berlim aconteceu em 1989.", isCorrect: true, explanation: "O Muro de Berlim caiu em 9 de novembro de 1989.", category: "dates" },
  { statement: "O homem pisou na Lua pela primeira vez em 1969.", isCorrect: true, explanation: "Neil Armstrong pisou na Lua em 20 de julho de 1969.", category: "dates" },
  { statement: "A Declaração Universal dos Direitos Humanos foi em 1948.", isCorrect: true, explanation: "Foi adotada pela ONU em 10 de dezembro de 1948.", category: "dates" },
  { statement: "A ONU foi fundada em 1955.", isCorrect: false, explanation: "A ONU foi fundada em 24 de outubro de 1945.", category: "dates" },
  { statement: "O ataque às Torres Gêmeas ocorreu em 2001.", isCorrect: true, explanation: "Os ataques de 11 de setembro aconteceram em 2001.", category: "dates" },
];

export function HistoryGame({ topic, onExit }: HistoryGameProps) {
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
    
    const available = filtered.filter((_, i) => !usedQuestions.has(questions.indexOf(filtered[i])));
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
      subject: 'history',
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
          className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Trophy className="w-16 h-16 text-white" />
        </motion.div>
        
        <h2 className="text-4xl font-bold">Fim de Jogo!</h2>
        <p className="text-xl text-muted-foreground">Sua pontuação</p>
        <div className="text-6xl font-black text-orange-500">{score}/{TOTAL_QUESTIONS}</div>

        <div className="flex gap-4">
          <Button onClick={onExit} variant="outline" size="lg" className="rounded-full px-8">
            <Home className="mr-2 w-5 h-5" /> Menu
          </Button>
          <Button onClick={() => window.location.reload()} size="lg" className="rounded-full px-8 bg-orange-500 hover:bg-orange-600">
            <RotateCcw className="mr-2 w-5 h-5" /> Jogar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-orange-500"/></div>;

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
            <p className="text-sm text-muted-foreground text-center mb-4">Esta afirmação está correta ou incorreta?</p>
            
            <div className="bg-white p-6 rounded-2xl border-2 border-border mb-8">
              <p className="text-xl md:text-2xl font-medium text-center">
                "{currentQuestion.statement}"
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
                
                <p className="text-lg text-muted-foreground mb-4">
                  {currentQuestion.explanation}
                </p>

                <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
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
