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
  // Brasil (20 questões)
  { statement: "O Brasil foi descoberto por Pedro Álvares Cabral em 1500.", isCorrect: true, explanation: "Pedro Álvares Cabral chegou ao Brasil em 22 de abril de 1500.", category: "brazil" },
  { statement: "A Independência do Brasil ocorreu em 7 de setembro de 1822.", isCorrect: true, explanation: "Dom Pedro I proclamou a independência às margens do rio Ipiranga.", category: "brazil" },
  { statement: "O Brasil foi uma monarquia durante todo o século XIX.", isCorrect: false, explanation: "O Brasil se tornou República em 15 de novembro de 1889.", category: "brazil" },
  { statement: "A escravidão foi abolida no Brasil em 1888 com a Lei Áurea.", isCorrect: true, explanation: "A Princesa Isabel assinou a Lei Áurea em 13 de maio de 1888.", category: "brazil" },
  { statement: "Getúlio Vargas governou o Brasil por 15 anos consecutivos.", isCorrect: true, explanation: "Vargas governou de 1930 a 1945, um total de 15 anos.", category: "brazil" },
  { statement: "A ditadura militar no Brasil durou de 1964 a 1985.", isCorrect: true, explanation: "O regime militar começou com o golpe de 1964 e terminou em 1985.", category: "brazil" },
  { statement: "Brasília foi inaugurada como capital em 1950.", isCorrect: false, explanation: "Brasília foi inaugurada em 21 de abril de 1960 por JK.", category: "brazil" },
  { statement: "A primeira capital do Brasil foi o Rio de Janeiro.", isCorrect: false, explanation: "A primeira capital foi Salvador, de 1549 a 1763.", category: "brazil" },
  { statement: "A Inconfidência Mineira ocorreu em 1789.", isCorrect: true, explanation: "A Inconfidência Mineira foi uma conspiração em 1789.", category: "brazil" },
  { statement: "Tiradentes foi o único condenado à morte na Inconfidência.", isCorrect: true, explanation: "Tiradentes foi enforcado em 21 de abril de 1792.", category: "brazil" },
  { statement: "O Brasil foi governado por Portugal até 1808.", isCorrect: false, explanation: "A família real chegou ao Brasil em 1808, mas a independência só ocorreu em 1822.", category: "brazil" },
  { statement: "D. Pedro II foi o último imperador do Brasil.", isCorrect: true, explanation: "D. Pedro II reinou de 1840 a 1889.", category: "brazil" },
  { statement: "A Guerra do Paraguai durou de 1864 a 1870.", isCorrect: true, explanation: "Foi o maior conflito armado da América do Sul.", category: "brazil" },
  { statement: "O voto feminino no Brasil foi permitido em 1932.", isCorrect: true, explanation: "O Código Eleitoral de 1932 permitiu o voto feminino.", category: "brazil" },
  { statement: "A Era Vargas começou com a Revolução de 1930.", isCorrect: true, explanation: "Getúlio Vargas assumiu o poder após a Revolução de 1930.", category: "brazil" },
  { statement: "O AI-5 foi decretado em 1968.", isCorrect: true, explanation: "O Ato Institucional nº 5 foi o mais repressivo da ditadura.", category: "brazil" },
  { statement: "As Diretas Já ocorreram em 1984.", isCorrect: true, explanation: "O movimento pedia eleições diretas para presidente.", category: "brazil" },
  { statement: "A Constituição atual do Brasil é de 1988.", isCorrect: true, explanation: "A Constituição Cidadã foi promulgada em 5 de outubro de 1988.", category: "brazil" },
  { statement: "O Plano Real foi criado em 1990.", isCorrect: false, explanation: "O Plano Real foi implementado em 1994.", category: "brazil" },
  { statement: "Fernando Henrique Cardoso foi o primeiro presidente eleito após a redemocratização.", isCorrect: false, explanation: "Fernando Collor foi o primeiro, em 1989.", category: "brazil" },
  
  // Mundial (20 questões)
  { statement: "As Pirâmides do Egito foram construídas pelos romanos.", isCorrect: false, explanation: "As pirâmides foram construídas pelos egípcios há mais de 4.500 anos.", category: "world" },
  { statement: "A Revolução Francesa começou em 1789.", isCorrect: true, explanation: "A queda da Bastilha em 14 de julho de 1789 marca o início.", category: "world" },
  { statement: "A Primeira Guerra Mundial começou em 1914.", isCorrect: true, explanation: "A guerra começou em 1914 após o assassinato de Franz Ferdinand.", category: "world" },
  { statement: "A Segunda Guerra Mundial terminou em 1945.", isCorrect: true, explanation: "A guerra terminou com a rendição do Japão em setembro de 1945.", category: "world" },
  { statement: "O Império Romano caiu no ano 476 d.C.", isCorrect: true, explanation: "O Império Romano do Ocidente caiu em 476 d.C.", category: "world" },
  { statement: "A Guerra Fria foi um conflito armado direto entre EUA e URSS.", isCorrect: false, explanation: "A Guerra Fria foi um conflito ideológico sem confronto direto.", category: "world" },
  { statement: "Cristóvão Colombo chegou à América em 1492.", isCorrect: true, explanation: "Colombo chegou às Américas em 12 de outubro de 1492.", category: "world" },
  { statement: "A Revolução Industrial começou na França.", isCorrect: false, explanation: "A Revolução Industrial começou na Inglaterra no século XVIII.", category: "world" },
  { statement: "Napoleão Bonaparte foi imperador da França.", isCorrect: true, explanation: "Napoleão governou a França de 1804 a 1814/1815.", category: "world" },
  { statement: "A Grécia Antiga foi o berço da democracia.", isCorrect: true, explanation: "Atenas desenvolveu a democracia no século V a.C.", category: "world" },
  { statement: "Alexandre, o Grande, conquistou a Índia.", isCorrect: false, explanation: "Alexandre chegou à Índia mas não a conquistou completamente.", category: "world" },
  { statement: "O Renascimento começou na Itália.", isCorrect: true, explanation: "O Renascimento surgiu na Itália no século XIV.", category: "world" },
  { statement: "A Reforma Protestante foi iniciada por Martinho Lutero.", isCorrect: true, explanation: "Lutero publicou as 95 teses em 1517.", category: "world" },
  { statement: "A Revolução Russa ocorreu em 1917.", isCorrect: true, explanation: "A Revolução Bolchevique derrubou o czar em 1917.", category: "world" },
  { statement: "Mahatma Gandhi liderou a independência da Índia.", isCorrect: true, explanation: "Gandhi liderou o movimento de independência até 1947.", category: "world" },
  { statement: "Nelson Mandela foi presidente da África do Sul.", isCorrect: true, explanation: "Mandela governou de 1994 a 1999.", category: "world" },
  { statement: "A China se tornou comunista em 1959.", isCorrect: false, explanation: "A China se tornou comunista em 1949 com Mao Zedong.", category: "world" },
  { statement: "A União Soviética foi dissolvida em 1991.", isCorrect: true, explanation: "A URSS deixou de existir em 26 de dezembro de 1991.", category: "world" },
  { statement: "O Holocausto ocorreu durante a Primeira Guerra Mundial.", isCorrect: false, explanation: "O Holocausto ocorreu durante a Segunda Guerra Mundial.", category: "world" },
  { statement: "A Grande Muralha da China foi construída para defesa.", isCorrect: true, explanation: "Foi construída para proteger contra invasões nômades.", category: "world" },
  
  // Datas (20 questões)
  { statement: "A queda do Muro de Berlim aconteceu em 1989.", isCorrect: true, explanation: "O Muro de Berlim caiu em 9 de novembro de 1989.", category: "dates" },
  { statement: "O homem pisou na Lua pela primeira vez em 1969.", isCorrect: true, explanation: "Neil Armstrong pisou na Lua em 20 de julho de 1969.", category: "dates" },
  { statement: "A Declaração Universal dos Direitos Humanos foi em 1948.", isCorrect: true, explanation: "Foi adotada pela ONU em 10 de dezembro de 1948.", category: "dates" },
  { statement: "A ONU foi fundada em 1955.", isCorrect: false, explanation: "A ONU foi fundada em 24 de outubro de 1945.", category: "dates" },
  { statement: "O ataque às Torres Gêmeas ocorreu em 2001.", isCorrect: true, explanation: "Os ataques de 11 de setembro aconteceram em 2001.", category: "dates" },
  { statement: "A internet foi criada na década de 1960.", isCorrect: true, explanation: "A ARPANET, precursora da internet, surgiu em 1969.", category: "dates" },
  { statement: "O primeiro computador foi inventado em 1930.", isCorrect: false, explanation: "O ENIAC, primeiro computador, foi criado em 1946.", category: "dates" },
  { statement: "A bomba atômica foi lançada em Hiroshima em 1945.", isCorrect: true, explanation: "A bomba foi lançada em 6 de agosto de 1945.", category: "dates" },
  { statement: "A Primeira Guerra Mundial terminou em 1918.", isCorrect: true, explanation: "O armistício foi assinado em 11 de novembro de 1918.", category: "dates" },
  { statement: "O Euro foi introduzido em 2002.", isCorrect: false, explanation: "O Euro foi introduzido em 1 de janeiro de 1999 (notas em 2002).", category: "dates" },
  { statement: "A Copa do Mundo foi criada em 1930.", isCorrect: true, explanation: "A primeira Copa foi no Uruguai em 1930.", category: "dates" },
  { statement: "Os Jogos Olímpicos modernos começaram em 1896.", isCorrect: true, explanation: "A primeira Olimpíada moderna foi em Atenas, 1896.", category: "dates" },
  { statement: "O iPhone foi lançado em 2007.", isCorrect: true, explanation: "Steve Jobs apresentou o iPhone em 9 de janeiro de 2007.", category: "dates" },
  { statement: "O Facebook foi criado em 2004.", isCorrect: true, explanation: "Mark Zuckerberg lançou o Facebook em 4 de fevereiro de 2004.", category: "dates" },
  { statement: "A Wikipédia foi lançada em 2001.", isCorrect: true, explanation: "A Wikipédia foi lançada em 15 de janeiro de 2001.", category: "dates" },
  { statement: "O Google foi fundado em 1998.", isCorrect: true, explanation: "Larry Page e Sergey Brin fundaram o Google em 1998.", category: "dates" },
  { statement: "A clonagem da ovelha Dolly foi em 1996.", isCorrect: true, explanation: "Dolly nasceu em 5 de julho de 1996.", category: "dates" },
  { statement: "O acidente nuclear de Chernobyl foi em 1986.", isCorrect: true, explanation: "O desastre ocorreu em 26 de abril de 1986.", category: "dates" },
  { statement: "O Titanic afundou em 1912.", isCorrect: true, explanation: "O Titanic afundou em 15 de abril de 1912.", category: "dates" },
  { statement: "A penicilina foi descoberta em 1928.", isCorrect: true, explanation: "Alexander Fleming descobriu a penicilina em 1928.", category: "dates" },
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
    
    // Map filtered questions to their original indices
    const indexedFiltered = filtered.map(q => ({
      question: q,
      originalIndex: questions.indexOf(q)
    }));
    
    // Filter out already used questions
    const available = indexedFiltered.filter(item => !usedQuestions.has(item.originalIndex));
    const pool = available.length > 0 ? available : indexedFiltered;
    
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];
    
    setUsedQuestions(prev => new Set([...Array.from(prev), selected.originalIndex]));
    
    return selected.question;
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
