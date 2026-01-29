import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCreateResult } from "@/hooks/use-results";
import { Loader2, ArrowRight, CheckCircle2, XCircle, Trophy, Home, RotateCcw } from "lucide-react";

type Topic = 'brazilCapitals' | 'worldCapitals' | 'continents' | 'random';

interface GeographyGameProps {
  topic: Topic;
  onExit: () => void;
}

interface Question {
  prompt: string;
  options: string[];
  correctAnswer: string;
  category: string;
}

const TOTAL_QUESTIONS = 10;

const brazilStates = [
  // Todos os 26 estados + DF
  { state: 'São Paulo', capital: 'São Paulo' },
  { state: 'Rio de Janeiro', capital: 'Rio de Janeiro' },
  { state: 'Minas Gerais', capital: 'Belo Horizonte' },
  { state: 'Bahia', capital: 'Salvador' },
  { state: 'Paraná', capital: 'Curitiba' },
  { state: 'Rio Grande do Sul', capital: 'Porto Alegre' },
  { state: 'Pernambuco', capital: 'Recife' },
  { state: 'Ceará', capital: 'Fortaleza' },
  { state: 'Pará', capital: 'Belém' },
  { state: 'Maranhão', capital: 'São Luís' },
  { state: 'Goiás', capital: 'Goiânia' },
  { state: 'Amazonas', capital: 'Manaus' },
  { state: 'Santa Catarina', capital: 'Florianópolis' },
  { state: 'Espírito Santo', capital: 'Vitória' },
  { state: 'Paraíba', capital: 'João Pessoa' },
  { state: 'Rio Grande do Norte', capital: 'Natal' },
  { state: 'Alagoas', capital: 'Maceió' },
  { state: 'Piauí', capital: 'Teresina' },
  { state: 'Mato Grosso', capital: 'Cuiabá' },
  { state: 'Mato Grosso do Sul', capital: 'Campo Grande' },
  { state: 'Distrito Federal', capital: 'Brasília' },
  { state: 'Sergipe', capital: 'Aracaju' },
  { state: 'Rondônia', capital: 'Porto Velho' },
  { state: 'Tocantins', capital: 'Palmas' },
  { state: 'Acre', capital: 'Rio Branco' },
  { state: 'Amapá', capital: 'Macapá' },
  { state: 'Roraima', capital: 'Boa Vista' },
];

const worldCountries = [
  // Europa (20 países)
  { country: 'França', capital: 'Paris', continent: 'Europa' },
  { country: 'Alemanha', capital: 'Berlim', continent: 'Europa' },
  { country: 'Itália', capital: 'Roma', continent: 'Europa' },
  { country: 'Portugal', capital: 'Lisboa', continent: 'Europa' },
  { country: 'Espanha', capital: 'Madri', continent: 'Europa' },
  { country: 'Reino Unido', capital: 'Londres', continent: 'Europa' },
  { country: 'Países Baixos', capital: 'Amsterdã', continent: 'Europa' },
  { country: 'Bélgica', capital: 'Bruxelas', continent: 'Europa' },
  { country: 'Suíça', capital: 'Berna', continent: 'Europa' },
  { country: 'Áustria', capital: 'Viena', continent: 'Europa' },
  { country: 'Grécia', capital: 'Atenas', continent: 'Europa' },
  { country: 'Polônia', capital: 'Varsóvia', continent: 'Europa' },
  { country: 'Suécia', capital: 'Estocolmo', continent: 'Europa' },
  { country: 'Noruega', capital: 'Oslo', continent: 'Europa' },
  { country: 'Dinamarca', capital: 'Copenhague', continent: 'Europa' },
  { country: 'Finlândia', capital: 'Helsinque', continent: 'Europa' },
  { country: 'Irlanda', capital: 'Dublin', continent: 'Europa' },
  { country: 'República Tcheca', capital: 'Praga', continent: 'Europa' },
  { country: 'Hungria', capital: 'Budapeste', continent: 'Europa' },
  { country: 'Ucrânia', capital: 'Kiev', continent: 'Europa' },
  
  // Ásia (15 países)
  { country: 'Japão', capital: 'Tóquio', continent: 'Ásia' },
  { country: 'China', capital: 'Pequim', continent: 'Ásia' },
  { country: 'Índia', capital: 'Nova Délhi', continent: 'Ásia' },
  { country: 'Rússia', capital: 'Moscou', continent: 'Europa/Ásia' },
  { country: 'Coreia do Sul', capital: 'Seul', continent: 'Ásia' },
  { country: 'Coreia do Norte', capital: 'Pyongyang', continent: 'Ásia' },
  { country: 'Tailândia', capital: 'Bangcoc', continent: 'Ásia' },
  { country: 'Vietnã', capital: 'Hanói', continent: 'Ásia' },
  { country: 'Indonésia', capital: 'Jacarta', continent: 'Ásia' },
  { country: 'Filipinas', capital: 'Manila', continent: 'Ásia' },
  { country: 'Malásia', capital: 'Kuala Lumpur', continent: 'Ásia' },
  { country: 'Singapura', capital: 'Singapura', continent: 'Ásia' },
  { country: 'Turquia', capital: 'Ancara', continent: 'Europa/Ásia' },
  { country: 'Arábia Saudita', capital: 'Riad', continent: 'Ásia' },
  { country: 'Israel', capital: 'Jerusalém', continent: 'Ásia' },
  
  // América do Sul (10 países)
  { country: 'Argentina', capital: 'Buenos Aires', continent: 'América do Sul' },
  { country: 'Peru', capital: 'Lima', continent: 'América do Sul' },
  { country: 'Chile', capital: 'Santiago', continent: 'América do Sul' },
  { country: 'Colômbia', capital: 'Bogotá', continent: 'América do Sul' },
  { country: 'Venezuela', capital: 'Caracas', continent: 'América do Sul' },
  { country: 'Uruguai', capital: 'Montevidéu', continent: 'América do Sul' },
  { country: 'Paraguai', capital: 'Assunção', continent: 'América do Sul' },
  { country: 'Bolívia', capital: 'La Paz', continent: 'América do Sul' },
  { country: 'Equador', capital: 'Quito', continent: 'América do Sul' },
  { country: 'Guiana', capital: 'Georgetown', continent: 'América do Sul' },
  
  // América do Norte (3 países)
  { country: 'Estados Unidos', capital: 'Washington D.C.', continent: 'América do Norte' },
  { country: 'Canadá', capital: 'Ottawa', continent: 'América do Norte' },
  { country: 'México', capital: 'Cidade do México', continent: 'América do Norte' },
  
  // América Central e Caribe (7 países)
  { country: 'Cuba', capital: 'Havana', continent: 'América Central' },
  { country: 'Jamaica', capital: 'Kingston', continent: 'América Central' },
  { country: 'Haiti', capital: 'Porto Príncipe', continent: 'América Central' },
  { country: 'Guatemala', capital: 'Cidade da Guatemala', continent: 'América Central' },
  { country: 'Costa Rica', capital: 'San José', continent: 'América Central' },
  { country: 'Panamá', capital: 'Cidade do Panamá', continent: 'América Central' },
  { country: 'República Dominicana', capital: 'Santo Domingo', continent: 'América Central' },
  
  // África (15 países)
  { country: 'Egito', capital: 'Cairo', continent: 'África' },
  { country: 'África do Sul', capital: 'Pretória', continent: 'África' },
  { country: 'Nigéria', capital: 'Abuja', continent: 'África' },
  { country: 'Marrocos', capital: 'Rabat', continent: 'África' },
  { country: 'Etiópia', capital: 'Adis Abeba', continent: 'África' },
  { country: 'Quênia', capital: 'Nairóbi', continent: 'África' },
  { country: 'Angola', capital: 'Luanda', continent: 'África' },
  { country: 'Moçambique', capital: 'Maputo', continent: 'África' },
  { country: 'Gana', capital: 'Acra', continent: 'África' },
  { country: 'Senegal', capital: 'Dacar', continent: 'África' },
  { country: 'Argélia', capital: 'Argel', continent: 'África' },
  { country: 'Tunísia', capital: 'Túnis', continent: 'África' },
  { country: 'Líbia', capital: 'Trípoli', continent: 'África' },
  { country: 'Rep. Dem. do Congo', capital: 'Kinshasa', continent: 'África' },
  { country: 'Tanzânia', capital: 'Dodoma', continent: 'África' },
  
  // Oceania (5 países)
  { country: 'Austrália', capital: 'Canberra', continent: 'Oceania' },
  { country: 'Nova Zelândia', capital: 'Wellington', continent: 'Oceania' },
  { country: 'Fiji', capital: 'Suva', continent: 'Oceania' },
  { country: 'Papua Nova Guiné', capital: 'Port Moresby', continent: 'Oceania' },
  { country: 'Samoa', capital: 'Apia', continent: 'Oceania' },
];

const continents = ['Europa', 'Ásia', 'África', 'América do Sul', 'América do Norte', 'América Central', 'Oceania'];

export function GeographyGame({ topic, onExit }: GeographyGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  
  const createResult = useCreateResult();

  const generateQuestion = (): Question => {
    const questionType = topic === 'random' 
      ? ['brazilCapitals', 'worldCapitals', 'continents'][Math.floor(Math.random() * 3)]
      : topic;

    if (questionType === 'brazilCapitals') {
      const availableStates = brazilStates.filter(s => !usedQuestions.has(`brazil-${s.state}`));
      const pool = availableStates.length > 0 ? availableStates : brazilStates;
      const item = pool[Math.floor(Math.random() * pool.length)];
      setUsedQuestions(prev => new Set([...Array.from(prev), `brazil-${item.state}`]));
      const wrongOptions = brazilStates
        .filter(s => s.capital !== item.capital)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map(s => s.capital);
      const options = [item.capital, ...wrongOptions].sort(() => Math.random() - 0.5);
      
      return {
        prompt: `Qual é a capital de ${item.state}?`,
        options,
        correctAnswer: item.capital,
        category: 'brazilCapitals',
      };
    } else if (questionType === 'worldCapitals') {
      const availableCountries = worldCountries.filter(c => !usedQuestions.has(`world-${c.country}`));
      const pool = availableCountries.length > 0 ? availableCountries : worldCountries;
      const item = pool[Math.floor(Math.random() * pool.length)];
      setUsedQuestions(prev => new Set([...Array.from(prev), `world-${item.country}`]));
      const wrongOptions = worldCountries
        .filter(c => c.capital !== item.capital)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map(c => c.capital);
      const options = [item.capital, ...wrongOptions].sort(() => Math.random() - 0.5);
      
      return {
        prompt: `Qual é a capital de ${item.country}?`,
        options,
        correctAnswer: item.capital,
        category: 'worldCapitals',
      };
    } else {
      // Exclui países transcontinentais (com "/" no campo continente) para evitar ambiguidade
      const countriesWithSingleContinent = worldCountries.filter(c => !c.continent.includes('/'));
      const availableCountries = countriesWithSingleContinent.filter(c => !usedQuestions.has(`continent-${c.country}`));
      const pool = availableCountries.length > 0 ? availableCountries : countriesWithSingleContinent;
      const item = pool[Math.floor(Math.random() * pool.length)];
      setUsedQuestions(prev => new Set([...Array.from(prev), `continent-${item.country}`]));
      const correctContinent = item.continent;
      const wrongOptions = continents
        .filter(c => c !== correctContinent)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      const options = [correctContinent, ...wrongOptions].sort(() => Math.random() - 0.5);
      
      return {
        prompt: `Em qual continente fica ${item.country}?`,
        options,
        correctAnswer: correctContinent,
        category: 'continents',
      };
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
      subject: 'geography',
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
          className="w-32 h-32 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Trophy className="w-16 h-16 text-white" />
        </motion.div>
        
        <h2 className="text-4xl font-bold">Fim de Jogo!</h2>
        <p className="text-xl text-muted-foreground">Sua pontuação</p>
        <div className="text-6xl font-black text-cyan-500">{score}/{TOTAL_QUESTIONS}</div>

        <div className="flex gap-4">
          <Button onClick={onExit} variant="outline" size="lg" className="rounded-full px-8">
            <Home className="mr-2 w-5 h-5" /> Menu
          </Button>
          <Button onClick={() => window.location.reload()} size="lg" className="rounded-full px-8 bg-cyan-500 hover:bg-cyan-600">
            <RotateCcw className="mr-2 w-5 h-5" /> Jogar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-cyan-500"/></div>;

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
            
            <div className="grid gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={feedback !== null}
                  className={`p-5 text-xl font-bold rounded-2xl border-2 transition-all ${
                    feedback !== null
                      ? option === currentQuestion.correctAnswer
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : selectedAnswer === option
                          ? 'bg-red-100 border-red-500 text-red-700'
                          : 'bg-gray-100 border-gray-200 text-gray-400'
                      : 'bg-white border-border hover:border-cyan-500 hover:bg-cyan-50'
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

                <Button onClick={handleNext} className="bg-cyan-500 hover:bg-cyan-600">
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
