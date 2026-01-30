import { useState } from "react";
import { PreLiteracyGame } from "@/components/PreLiteracyGame";
import { PreLiteracyMenu } from "@/components/PreLiteracyMenu";
import { AnimatePresence, motion } from "framer-motion";

type View = 'menu' | 'game';
type QuestionType = 'firstLetter' | 'completeWord' | 'soundMatch' | 'initialSyllable';

export default function PreLiteracyPage() {
  const [view, setView] = useState<View>('menu');
  const [selectedType, setSelectedType] = useState<QuestionType>('firstLetter');

  const handleStartGame = (type: QuestionType) => {
    setSelectedType(type);
    setView('game');
  };

  const handleExitGame = () => {
    setView('menu');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {view === 'menu' ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full"
          >
            <PreLiteracyMenu onSelectType={handleStartGame} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <PreLiteracyGame 
              questionType={selectedType} 
              onExit={handleExitGame} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
