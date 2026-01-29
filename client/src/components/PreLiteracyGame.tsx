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
  // Animais (60 palavras) - com acentuação correta
  { word: 'GATO', syllables: ['GA', 'TO'], firstLetter: 'G' },
  { word: 'PATO', syllables: ['PA', 'TO'], firstLetter: 'P' },
  { word: 'SAPO', syllables: ['SA', 'PO'], firstLetter: 'S' },
  { word: 'RATO', syllables: ['RA', 'TO'], firstLetter: 'R' },
  { word: 'VACA', syllables: ['VA', 'CA'], firstLetter: 'V' },
  { word: 'FOCA', syllables: ['FO', 'CA'], firstLetter: 'F' },
  { word: 'TATU', syllables: ['TA', 'TU'], firstLetter: 'T' },
  { word: 'LOBO', syllables: ['LO', 'BO'], firstLetter: 'L' },
  { word: 'GALO', syllables: ['GA', 'LO'], firstLetter: 'G' },
  { word: 'PACA', syllables: ['PA', 'CA'], firstLetter: 'P' },
  { word: 'ANTA', syllables: ['AN', 'TA'], firstLetter: 'A' },
  { word: 'PUMA', syllables: ['PU', 'MA'], firstLetter: 'P' },
  { word: 'URSO', syllables: ['UR', 'SO'], firstLetter: 'U' },
  { word: 'LEÃO', syllables: ['LE', 'ÃO'], firstLetter: 'L' },
  { word: 'ONÇA', syllables: ['ON', 'ÇA'], firstLetter: 'O' },
  { word: 'MICO', syllables: ['MI', 'CO'], firstLetter: 'M' },
  { word: 'PERU', syllables: ['PE', 'RU'], firstLetter: 'P' },
  { word: 'RENA', syllables: ['RE', 'NA'], firstLetter: 'R' },
  { word: 'ORCA', syllables: ['OR', 'CA'], firstLetter: 'O' },
  { word: 'ARARA', syllables: ['A', 'RA', 'RA'], firstLetter: 'A' },
  { word: 'BURRO', syllables: ['BU', 'RRO'], firstLetter: 'B' },
  { word: 'COBRA', syllables: ['CO', 'BRA'], firstLetter: 'C' },
  { word: 'CORVO', syllables: ['COR', 'VO'], firstLetter: 'C' },
  { word: 'CABRA', syllables: ['CA', 'BRA'], firstLetter: 'C' },
  { word: 'ELEFANTE', syllables: ['E', 'LE', 'FAN', 'TE'], firstLetter: 'E' },
  { word: 'FORMIGA', syllables: ['FOR', 'MI', 'GA'], firstLetter: 'F' },
  { word: 'GIRAFA', syllables: ['GI', 'RA', 'FA'], firstLetter: 'G' },
  { word: 'GALINHA', syllables: ['GA', 'LI', 'NHA'], firstLetter: 'G' },
  { word: 'HIPOPÓTAMO', syllables: ['HI', 'PO', 'PÓ', 'TA', 'MO'], firstLetter: 'H' },
  { word: 'IGUANA', syllables: ['I', 'GUA', 'NA'], firstLetter: 'I' },
  { word: 'JACARÉ', syllables: ['JA', 'CA', 'RÉ'], firstLetter: 'J' },
  { word: 'LAGARTO', syllables: ['LA', 'GAR', 'TO'], firstLetter: 'L' },
  { word: 'MACACO', syllables: ['MA', 'CA', 'CO'], firstLetter: 'M' },
  { word: 'MORCEGO', syllables: ['MOR', 'CE', 'GO'], firstLetter: 'M' },
  { word: 'MOSCA', syllables: ['MOS', 'CA'], firstLetter: 'M' },
  { word: 'PÁSSARO', syllables: ['PÁS', 'SA', 'RO'], firstLetter: 'P' },
  { word: 'PEIXE', syllables: ['PEI', 'XE'], firstLetter: 'P' },
  { word: 'PORCO', syllables: ['POR', 'CO'], firstLetter: 'P' },
  { word: 'RAPOSA', syllables: ['RA', 'PO', 'SA'], firstLetter: 'R' },
  { word: 'SABIÁ', syllables: ['SA', 'BI', 'Á'], firstLetter: 'S' },
  { word: 'TARTARUGA', syllables: ['TAR', 'TA', 'RU', 'GA'], firstLetter: 'T' },
  { word: 'TIGRE', syllables: ['TI', 'GRE'], firstLetter: 'T' },
  { word: 'TUBARÃO', syllables: ['TU', 'BA', 'RÃO'], firstLetter: 'T' },
  { word: 'URUBU', syllables: ['U', 'RU', 'BU'], firstLetter: 'U' },
  { word: 'ZEBRA', syllables: ['ZE', 'BRA'], firstLetter: 'Z' },
  { word: 'CAVALO', syllables: ['CA', 'VA', 'LO'], firstLetter: 'C' },
  { word: 'OVELHA', syllables: ['O', 'VE', 'LHA'], firstLetter: 'O' },
  { word: 'CACHORRO', syllables: ['CA', 'CHO', 'RRO'], firstLetter: 'C' },
  { word: 'COELHO', syllables: ['CO', 'E', 'LHO'], firstLetter: 'C' },
  { word: 'LEBRE', syllables: ['LE', 'BRE'], firstLetter: 'L' },
  { word: 'BALEIA', syllables: ['BA', 'LEI', 'A'], firstLetter: 'B' },
  { word: 'GOLFINHO', syllables: ['GOL', 'FI', 'NHO'], firstLetter: 'G' },
  { word: 'VEADO', syllables: ['VE', 'A', 'DO'], firstLetter: 'V' },
  { word: 'CORUJA', syllables: ['CO', 'RU', 'JA'], firstLetter: 'C' },
  { word: 'ÁGUIA', syllables: ['Á', 'GUI', 'A'], firstLetter: 'Á' },
  { word: 'FALCÃO', syllables: ['FAL', 'CÃO'], firstLetter: 'F' },
  { word: 'POMBO', syllables: ['POM', 'BO'], firstLetter: 'P' },
  { word: 'GANSO', syllables: ['GAN', 'SO'], firstLetter: 'G' },
  { word: 'CISNE', syllables: ['CIS', 'NE'], firstLetter: 'C' },
  { word: 'FAISÃO', syllables: ['FAI', 'SÃO'], firstLetter: 'F' },
  
  // Objetos (60 palavras) - com acentuação correta
  { word: 'BOLA', syllables: ['BO', 'LA'], firstLetter: 'B' },
  { word: 'CASA', syllables: ['CA', 'SA'], firstLetter: 'C' },
  { word: 'MALA', syllables: ['MA', 'LA'], firstLetter: 'M' },
  { word: 'LUVA', syllables: ['LU', 'VA'], firstLetter: 'L' },
  { word: 'DADO', syllables: ['DA', 'DO'], firstLetter: 'D' },
  { word: 'JACA', syllables: ['JA', 'CA'], firstLetter: 'J' },
  { word: 'NABO', syllables: ['NA', 'BO'], firstLetter: 'N' },
  { word: 'MESA', syllables: ['ME', 'SA'], firstLetter: 'M' },
  { word: 'SOPA', syllables: ['SO', 'PA'], firstLetter: 'S' },
  { word: 'BOLO', syllables: ['BO', 'LO'], firstLetter: 'B' },
  { word: 'TELA', syllables: ['TE', 'LA'], firstLetter: 'T' },
  { word: 'FACA', syllables: ['FA', 'CA'], firstLetter: 'F' },
  { word: 'RODA', syllables: ['RO', 'DA'], firstLetter: 'R' },
  { word: 'CAMA', syllables: ['CA', 'MA'], firstLetter: 'C' },
  { word: 'LAGO', syllables: ['LA', 'GO'], firstLetter: 'L' },
  { word: 'VELA', syllables: ['VE', 'LA'], firstLetter: 'V' },
  { word: 'SALA', syllables: ['SA', 'LA'], firstLetter: 'S' },
  { word: 'PIPA', syllables: ['PI', 'PA'], firstLetter: 'P' },
  { word: 'COPO', syllables: ['CO', 'PO'], firstLetter: 'C' },
  { word: 'LATA', syllables: ['LA', 'TA'], firstLetter: 'L' },
  { word: 'BOLSA', syllables: ['BOL', 'SA'], firstLetter: 'B' },
  { word: 'CAIXA', syllables: ['CAI', 'XA'], firstLetter: 'C' },
  { word: 'CALÇA', syllables: ['CAL', 'ÇA'], firstLetter: 'C' },
  { word: 'CAMISA', syllables: ['CA', 'MI', 'SA'], firstLetter: 'C' },
  { word: 'CANETA', syllables: ['CA', 'NE', 'TA'], firstLetter: 'C' },
  { word: 'CADEIRA', syllables: ['CA', 'DEI', 'RA'], firstLetter: 'C' },
  { word: 'CADERNO', syllables: ['CA', 'DER', 'NO'], firstLetter: 'C' },
  { word: 'CHAVE', syllables: ['CHA', 'VE'], firstLetter: 'C' },
  { word: 'COLHER', syllables: ['CO', 'LHER'], firstLetter: 'C' },
  { word: 'GARFO', syllables: ['GAR', 'FO'], firstLetter: 'G' },
  { word: 'JANELA', syllables: ['JA', 'NE', 'LA'], firstLetter: 'J' },
  { word: 'JARRA', syllables: ['JA', 'RRA'], firstLetter: 'J' },
  { word: 'LÂMPADA', syllables: ['LÂM', 'PA', 'DA'], firstLetter: 'L' },
  { word: 'LÁPIS', syllables: ['LÁ', 'PIS'], firstLetter: 'L' },
  { word: 'LIVRO', syllables: ['LI', 'VRO'], firstLetter: 'L' },
  { word: 'MOCHILA', syllables: ['MO', 'CHI', 'LA'], firstLetter: 'M' },
  { word: 'PANELA', syllables: ['PA', 'NE', 'LA'], firstLetter: 'P' },
  { word: 'PAPEL', syllables: ['PA', 'PEL'], firstLetter: 'P' },
  { word: 'PRATO', syllables: ['PRA', 'TO'], firstLetter: 'P' },
  { word: 'PORTA', syllables: ['POR', 'TA'], firstLetter: 'P' },
  { word: 'RELÓGIO', syllables: ['RE', 'LÓ', 'GIO'], firstLetter: 'R' },
  { word: 'ROUPA', syllables: ['ROU', 'PA'], firstLetter: 'R' },
  { word: 'SAPATO', syllables: ['SA', 'PA', 'TO'], firstLetter: 'S' },
  { word: 'SOFÁ', syllables: ['SO', 'FÁ'], firstLetter: 'S' },
  { word: 'TAPETE', syllables: ['TA', 'PE', 'TE'], firstLetter: 'T' },
  { word: 'TELEFONE', syllables: ['TE', 'LE', 'FO', 'NE'], firstLetter: 'T' },
  { word: 'TELEVISÃO', syllables: ['TE', 'LE', 'VI', 'SÃO'], firstLetter: 'T' },
  { word: 'TESOURA', syllables: ['TE', 'SOU', 'RA'], firstLetter: 'T' },
  { word: 'VASSOURA', syllables: ['VA', 'SSOU', 'RA'], firstLetter: 'V' },
  { word: 'VESTIDO', syllables: ['VES', 'TI', 'DO'], firstLetter: 'V' },
  { word: 'XÍCARA', syllables: ['XÍ', 'CA', 'RA'], firstLetter: 'X' },
  { word: 'BONECA', syllables: ['BO', 'NE', 'CA'], firstLetter: 'B' },
  { word: 'CARRINHO', syllables: ['CA', 'RRI', 'NHO'], firstLetter: 'C' },
  { word: 'BICICLETA', syllables: ['BI', 'CI', 'CLE', 'TA'], firstLetter: 'B' },
  { word: 'GUARDA-CHUVA', syllables: ['GUAR', 'DA', 'CHU', 'VA'], firstLetter: 'G' },
  { word: 'ESCOVA', syllables: ['ES', 'CO', 'VA'], firstLetter: 'E' },
  { word: 'PASTA', syllables: ['PAS', 'TA'], firstLetter: 'P' },
  { word: 'TOALHA', syllables: ['TO', 'A', 'LHA'], firstLetter: 'T' },
  { word: 'ESPELHO', syllables: ['ES', 'PE', 'LHO'], firstLetter: 'E' },
  { word: 'FOGÃO', syllables: ['FO', 'GÃO'], firstLetter: 'F' },
  
  // Natureza e outros (60 palavras) - com acentuação correta
  { word: 'ROSA', syllables: ['RO', 'SA'], firstLetter: 'R' },
  { word: 'NEVE', syllables: ['NE', 'VE'], firstLetter: 'N' },
  { word: 'NUVEM', syllables: ['NU', 'VEM'], firstLetter: 'N' },
  { word: 'FOGO', syllables: ['FO', 'GO'], firstLetter: 'F' },
  { word: 'MATO', syllables: ['MA', 'TO'], firstLetter: 'M' },
  { word: 'RAIO', syllables: ['RAI', 'O'], firstLetter: 'R' },
  { word: 'VASO', syllables: ['VA', 'SO'], firstLetter: 'V' },
  { word: 'SINO', syllables: ['SI', 'NO'], firstLetter: 'S' },
  { word: 'POTE', syllables: ['PO', 'TE'], firstLetter: 'P' },
  { word: 'DEDO', syllables: ['DE', 'DO'], firstLetter: 'D' },
  { word: 'GELO', syllables: ['GE', 'LO'], firstLetter: 'G' },
  { word: 'RAMO', syllables: ['RA', 'MO'], firstLetter: 'R' },
  { word: 'BECO', syllables: ['BE', 'CO'], firstLetter: 'B' },
  { word: 'PANO', syllables: ['PA', 'NO'], firstLetter: 'P' },
  { word: 'SACO', syllables: ['SA', 'CO'], firstLetter: 'S' },
  { word: 'MURO', syllables: ['MU', 'RO'], firstLetter: 'M' },
  { word: 'TOCO', syllables: ['TO', 'CO'], firstLetter: 'T' },
  { word: 'GOTA', syllables: ['GO', 'TA'], firstLetter: 'G' },
  { word: 'BICA', syllables: ['BI', 'CA'], firstLetter: 'B' },
  { word: 'CABO', syllables: ['CA', 'BO'], firstLetter: 'C' },
  { word: 'ÁGUA', syllables: ['Á', 'GUA'], firstLetter: 'Á' },
  { word: 'ÁRVORE', syllables: ['ÁR', 'VO', 'RE'], firstLetter: 'Á' },
  { word: 'BANANA', syllables: ['BA', 'NA', 'NA'], firstLetter: 'B' },
  { word: 'CARRO', syllables: ['CA', 'RRO'], firstLetter: 'C' },
  { word: 'CHUVA', syllables: ['CHU', 'VA'], firstLetter: 'C' },
  { word: 'ESTRELA', syllables: ['ES', 'TRE', 'LA'], firstLetter: 'E' },
  { word: 'FLOR', syllables: ['FLOR'], firstLetter: 'F' },
  { word: 'FOLHA', syllables: ['FO', 'LHA'], firstLetter: 'F' },
  { word: 'FRUTA', syllables: ['FRU', 'TA'], firstLetter: 'F' },
  { word: 'LARANJA', syllables: ['LA', 'RAN', 'JA'], firstLetter: 'L' },
  { word: 'LIMÃO', syllables: ['LI', 'MÃO'], firstLetter: 'L' },
  { word: 'LUA', syllables: ['LU', 'A'], firstLetter: 'L' },
  { word: 'MAR', syllables: ['MAR'], firstLetter: 'M' },
  { word: 'MAÇÃ', syllables: ['MA', 'ÇÃ'], firstLetter: 'M' },
  { word: 'MELANCIA', syllables: ['ME', 'LAN', 'CI', 'A'], firstLetter: 'M' },
  { word: 'MONTANHA', syllables: ['MON', 'TA', 'NHA'], firstLetter: 'M' },
  { word: 'MORANGO', syllables: ['MO', 'RAN', 'GO'], firstLetter: 'M' },
  { word: 'NINHO', syllables: ['NI', 'NHO'], firstLetter: 'N' },
  { word: 'OVO', syllables: ['O', 'VO'], firstLetter: 'O' },
  { word: 'PEDRA', syllables: ['PE', 'DRA'], firstLetter: 'P' },
  { word: 'PERA', syllables: ['PE', 'RA'], firstLetter: 'P' },
  { word: 'PRAIA', syllables: ['PRAI', 'A'], firstLetter: 'P' },
  { word: 'RIO', syllables: ['RI', 'O'], firstLetter: 'R' },
  { word: 'SOL', syllables: ['SOL'], firstLetter: 'S' },
  { word: 'TERRA', syllables: ['TE', 'RRA'], firstLetter: 'T' },
  { word: 'VENTO', syllables: ['VEN', 'TO'], firstLetter: 'V' },
  { word: 'VERDE', syllables: ['VER', 'DE'], firstLetter: 'V' },
  { word: 'AZUL', syllables: ['A', 'ZUL'], firstLetter: 'A' },
  { word: 'AMARELO', syllables: ['A', 'MA', 'RE', 'LO'], firstLetter: 'A' },
  { word: 'VERMELHO', syllables: ['VER', 'ME', 'LHO'], firstLetter: 'V' },
  { word: 'BRANCO', syllables: ['BRAN', 'CO'], firstLetter: 'B' },
  { word: 'PRETO', syllables: ['PRE', 'TO'], firstLetter: 'P' },
  { word: 'ROXO', syllables: ['RO', 'XO'], firstLetter: 'R' },
  { word: 'CINZA', syllables: ['CIN', 'ZA'], firstLetter: 'C' },
  { word: 'MARROM', syllables: ['MA', 'RROM'], firstLetter: 'M' },
  { word: 'JARDIM', syllables: ['JAR', 'DIM'], firstLetter: 'J' },
  { word: 'PARQUE', syllables: ['PAR', 'QUE'], firstLetter: 'P' },
  { word: 'ESCOLA', syllables: ['ES', 'CO', 'LA'], firstLetter: 'E' },
  { word: 'IGREJA', syllables: ['I', 'GRE', 'JA'], firstLetter: 'I' },
  { word: 'ÓCULOS', syllables: ['Ó', 'CU', 'LOS'], firstLetter: 'Ó' },
];

const allLetters = ['A', 'Á', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'Ó', 'P', 'R', 'S', 'T', 'U', 'V', 'X', 'Z'];
const allSyllables = ['BA', 'BO', 'CA', 'DA', 'FA', 'FO', 'GA', 'JA', 'LA', 'LU', 'MA', 'NA', 'PA', 'PO', 'RA', 'SA', 'TA', 'TU', 'VA'];

// Conjunto de todas as palavras válidas para evitar ambiguidades no modo Completar
const allWordSet = new Set(words.map(w => w.word));

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
        const firstLetter = wordData.firstLetter;
        // Filtra sufixos que NÃO formam palavras válidas quando combinados com a primeira letra
        const wrongOptions = words
          .filter(w => w.word !== wordData.word)
          .map(w => w.word.slice(1))
          .filter(suffix => !allWordSet.has(firstLetter + suffix)) // Evita ambiguidades
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        const options = [missing, ...wrongOptions].sort(() => Math.random() - 0.5);
        return {
          type: 'completeWord',
          prompt: `Complete: ${firstLetter}___`,
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
