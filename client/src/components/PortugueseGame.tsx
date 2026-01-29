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
  // Gramática (20 questões)
  { sentence: "Fazem dois anos que não o vejo.", isCorrect: false, correction: "Faz dois anos que não o vejo.", category: "grammar" },
  { sentence: "Houveram muitos acidentes ontem.", isCorrect: false, correction: "Houve muitos acidentes ontem.", category: "grammar" },
  { sentence: "Ela está meia cansada hoje.", isCorrect: false, correction: "Ela está meio cansada hoje.", category: "grammar" },
  { sentence: "Nós assistimos o filme ontem.", isCorrect: false, correction: "Nós assistimos ao filme ontem.", category: "grammar" },
  { sentence: "Ele chegou atrasado na reunião.", isCorrect: true, correction: "", category: "grammar" },
  { sentence: "Para mim fazer isso é difícil.", isCorrect: false, correction: "Para eu fazer isso é difícil.", category: "grammar" },
  { sentence: "Ela preferiu mais o vestido azul.", isCorrect: false, correction: "Ela preferiu o vestido azul.", category: "grammar" },
  { sentence: "Eu lhe amo muito.", isCorrect: false, correction: "Eu a amo muito. / Eu te amo muito.", category: "grammar" },
  { sentence: "Ele obedece os pais.", isCorrect: false, correction: "Ele obedece aos pais.", category: "grammar" },
  { sentence: "Ela respondeu a pergunta.", isCorrect: false, correction: "Ela respondeu à pergunta.", category: "grammar" },
  { sentence: "A mãe chamou o filho.", isCorrect: true, correction: "", category: "grammar" },
  { sentence: "O professor explicou a lição.", isCorrect: true, correction: "", category: "grammar" },
  { sentence: "Nós vamos no cinema.", isCorrect: false, correction: "Nós vamos ao cinema.", category: "grammar" },
  { sentence: "Eu prefiro pizza do que hambúrguer.", isCorrect: false, correction: "Eu prefiro pizza a hambúrguer.", category: "grammar" },
  { sentence: "Ela namorou com ele por anos.", isCorrect: false, correction: "Ela namorou ele por anos.", category: "grammar" },
  { sentence: "Ele esqueceu de trazer o livro.", isCorrect: false, correction: "Ele esqueceu o livro.", category: "grammar" },
  { sentence: "Lembrei-me do aniversário.", isCorrect: true, correction: "", category: "grammar" },
  { sentence: "Havia muitas pessoas na festa.", isCorrect: true, correction: "", category: "grammar" },
  { sentence: "Isso implica em problemas.", isCorrect: false, correction: "Isso implica problemas.", category: "grammar" },
  { sentence: "Ele aspira o cargo de diretor.", isCorrect: false, correction: "Ele aspira ao cargo de diretor.", category: "grammar" },
  
  // Ortografia (20 questões)
  { sentence: "Ela quiz ir embora cedo.", isCorrect: false, correction: "Ela quis ir embora cedo.", category: "spelling" },
  { sentence: "Vou analizar o documento.", isCorrect: false, correction: "Vou analisar o documento.", category: "spelling" },
  { sentence: "Ele tem previlégio especial.", isCorrect: false, correction: "Ele tem privilégio especial.", category: "spelling" },
  { sentence: "A exceção confirma a regra.", isCorrect: true, correction: "", category: "spelling" },
  { sentence: "Ele foi a passeio no parque.", isCorrect: false, correction: "Ele foi passear no parque.", category: "spelling" },
  { sentence: "Ela está anciousa pela viagem.", isCorrect: false, correction: "Ela está ansiosa pela viagem.", category: "spelling" },
  { sentence: "O advogado foi ao cartório.", isCorrect: true, correction: "", category: "spelling" },
  { sentence: "O menino está exitado com a festa.", isCorrect: false, correction: "O menino está excitado com a festa.", category: "spelling" },
  { sentence: "Vou fazer uma pesquisa.", isCorrect: true, correction: "", category: "spelling" },
  { sentence: "A professora corrijiu a prova.", isCorrect: false, correction: "A professora corrigiu a prova.", category: "spelling" },
  { sentence: "Ele tem muito bom senso.", isCorrect: true, correction: "", category: "spelling" },
  { sentence: "O bebê nasceu saudável.", isCorrect: true, correction: "", category: "spelling" },
  { sentence: "A música está muito auto.", isCorrect: false, correction: "A música está muito alta.", category: "spelling" },
  { sentence: "Preciso comprar mantimentos.", isCorrect: true, correction: "", category: "spelling" },
  { sentence: "Ela tem muita esperiência.", isCorrect: false, correction: "Ela tem muita experiência.", category: "spelling" },
  { sentence: "O réu foi absolvido.", isCorrect: true, correction: "", category: "spelling" },
  { sentence: "Ele foi à farmácia.", isCorrect: true, correction: "", category: "spelling" },
  { sentence: "A empresa está em expanção.", isCorrect: false, correction: "A empresa está em expansão.", category: "spelling" },
  { sentence: "O ónibus atrasou.", isCorrect: false, correction: "O ônibus atrasou.", category: "spelling" },
  { sentence: "Preciso de ajuda urgente.", isCorrect: true, correction: "", category: "spelling" },
  
  // Concordância (20 questões)
  { sentence: "Os alunos estava cansados.", isCorrect: false, correction: "Os alunos estavam cansados.", category: "agreement" },
  { sentence: "A maioria dos alunos faltou.", isCorrect: true, correction: "", category: "agreement" },
  { sentence: "Haviam pessoas na fila.", isCorrect: false, correction: "Havia pessoas na fila.", category: "agreement" },
  { sentence: "As crianças brincavam felizes.", isCorrect: true, correction: "", category: "agreement" },
  { sentence: "Faz-se reformas aqui.", isCorrect: false, correction: "Fazem-se reformas aqui.", category: "agreement" },
  { sentence: "Os meninos correu para casa.", isCorrect: false, correction: "Os meninos correram para casa.", category: "agreement" },
  { sentence: "A equipe venceu o campeonato.", isCorrect: true, correction: "", category: "agreement" },
  { sentence: "Os livros custam caro.", isCorrect: true, correction: "", category: "agreement" },
  { sentence: "Os Estados Unidos é um país grande.", isCorrect: false, correction: "Os Estados Unidos são um país grande.", category: "agreement" },
  { sentence: "Aluga-se apartamentos.", isCorrect: false, correction: "Alugam-se apartamentos.", category: "agreement" },
  { sentence: "A gente fomos ao parque.", isCorrect: false, correction: "A gente foi ao parque.", category: "agreement" },
  { sentence: "Existem muitas opções.", isCorrect: true, correction: "", category: "agreement" },
  { sentence: "Precisa-se de funcionários.", isCorrect: true, correction: "", category: "agreement" },
  { sentence: "Faltam três dias para a prova.", isCorrect: true, correction: "", category: "agreement" },
  { sentence: "Bateu três horas no relógio.", isCorrect: false, correction: "Bateram três horas no relógio.", category: "agreement" },
  { sentence: "Deu dez horas no sino.", isCorrect: false, correction: "Deram dez horas no sino.", category: "agreement" },
  { sentence: "A maioria das pessoas concordou.", isCorrect: true, correction: "", category: "agreement" },
  { sentence: "Os professores e alunos chegou.", isCorrect: false, correction: "Os professores e alunos chegaram.", category: "agreement" },
  { sentence: "Eu e ela fomos ao cinema.", isCorrect: true, correction: "", category: "agreement" },
  { sentence: "As meninas estavam alegre.", isCorrect: false, correction: "As meninas estavam alegres.", category: "agreement" },
  
  // Semântica (20 questões)
  { sentence: "Ele é um homem de bom coração.", isCorrect: true, correction: "", category: "semantics" },
  { sentence: "A festa foi muito mais melhor.", isCorrect: false, correction: "A festa foi muito melhor.", category: "semantics" },
  { sentence: "Subir para cima é redundante.", isCorrect: true, correction: "", category: "semantics" },
  { sentence: "Ele entrou para dentro da sala.", isCorrect: false, correction: "Ele entrou na sala.", category: "semantics" },
  { sentence: "A menina ganhou um presente.", isCorrect: true, correction: "", category: "semantics" },
  { sentence: "Ele saiu para fora correndo.", isCorrect: false, correction: "Ele saiu correndo.", category: "semantics" },
  { sentence: "A sua opinião pessoal é válida.", isCorrect: false, correction: "A sua opinião é válida. (opinião já é pessoal)", category: "semantics" },
  { sentence: "Ela tem um elo de ligação com ele.", isCorrect: false, correction: "Ela tem um elo com ele.", category: "semantics" },
  { sentence: "O resultado final foi positivo.", isCorrect: false, correction: "O resultado foi positivo.", category: "semantics" },
  { sentence: "O livro é muito interessante.", isCorrect: true, correction: "", category: "semantics" },
  { sentence: "Ele retrocedeu para trás.", isCorrect: false, correction: "Ele retrocedeu.", category: "semantics" },
  { sentence: "O consenso geral foi favorável.", isCorrect: false, correction: "O consenso foi favorável.", category: "semantics" },
  { sentence: "Ela é a protagonista principal.", isCorrect: false, correction: "Ela é a protagonista.", category: "semantics" },
  { sentence: "A criança brinca no jardim.", isCorrect: true, correction: "", category: "semantics" },
  { sentence: "Ele criou uma nova inovação.", isCorrect: false, correction: "Ele criou uma inovação.", category: "semantics" },
  { sentence: "O projeto está bem elaborado.", isCorrect: true, correction: "", category: "semantics" },
  { sentence: "É grátis e não paga nada.", isCorrect: false, correction: "É grátis. / Não paga nada.", category: "semantics" },
  { sentence: "O panorama geral é positivo.", isCorrect: false, correction: "O panorama é positivo.", category: "semantics" },
  { sentence: "Ela fez uma breve introdução.", isCorrect: true, correction: "", category: "semantics" },
  { sentence: "Ele tem certeza absoluta.", isCorrect: false, correction: "Ele tem certeza.", category: "semantics" },
  
  // Pontuação (20 questões)
  { sentence: "João disse eu vou sair.", isCorrect: false, correction: "João disse: \"Eu vou sair.\"", category: "punctuation" },
  { sentence: "Maria, a professora, chegou.", isCorrect: true, correction: "", category: "punctuation" },
  { sentence: "Comprei: maçãs laranjas e bananas.", isCorrect: false, correction: "Comprei maçãs, laranjas e bananas.", category: "punctuation" },
  { sentence: "Ele perguntou, onde você vai?", isCorrect: false, correction: "Ele perguntou: \"Onde você vai?\"", category: "punctuation" },
  { sentence: "O menino, que corria, caiu.", isCorrect: true, correction: "", category: "punctuation" },
  { sentence: "Pedro meu amigo chegou.", isCorrect: false, correction: "Pedro, meu amigo, chegou.", category: "punctuation" },
  { sentence: "A casa, que era velha desabou.", isCorrect: false, correction: "A casa, que era velha, desabou.", category: "punctuation" },
  { sentence: "Ela disse: \"Vou embora.\"", isCorrect: true, correction: "", category: "punctuation" },
  { sentence: "São Paulo, a maior cidade brasileira, é movimentada.", isCorrect: true, correction: "", category: "punctuation" },
  { sentence: "Estudei muito portanto passei.", isCorrect: false, correction: "Estudei muito; portanto, passei.", category: "punctuation" },
  { sentence: "Não sei, se ele vem.", isCorrect: false, correction: "Não sei se ele vem.", category: "punctuation" },
  { sentence: "Quero saber: quando você chega?", isCorrect: false, correction: "Quero saber quando você chega.", category: "punctuation" },
  { sentence: "Ele trabalha; ela estuda.", isCorrect: true, correction: "", category: "punctuation" },
  { sentence: "A menina alegre sorriu.", isCorrect: true, correction: "", category: "punctuation" },
  { sentence: "Preciso de: papel caneta e lápis.", isCorrect: false, correction: "Preciso de papel, caneta e lápis.", category: "punctuation" },
  { sentence: "Contudo, ele não desistiu.", isCorrect: true, correction: "", category: "punctuation" },
  { sentence: "Ela correu e chegou a tempo.", isCorrect: true, correction: "", category: "punctuation" },
  { sentence: "Marcos: o aluno novo, sentou-se.", isCorrect: false, correction: "Marcos, o aluno novo, sentou-se.", category: "punctuation" },
  { sentence: "Amanhã, irei à escola.", isCorrect: true, correction: "", category: "punctuation" },
  { sentence: "O livro que comprei é bom.", isCorrect: true, correction: "", category: "punctuation" },
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
