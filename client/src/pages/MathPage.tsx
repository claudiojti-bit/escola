import { useState } from "react";
import { MathGame } from "@/components/MathGame";
import { MathMenu } from "@/components/MathMenu";
import { AnimatePresence, motion } from "framer-motion";

type View = 'menu' | 'game';
type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export default function MathPage() {
  const [view, setView] = useState<View>('menu');
  const [selectedOperation, setSelectedOperation] = useState<Operation>('addition');

  const handleStartGame = (operation: Operation) => {
    setSelectedOperation(operation);
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
            <MathMenu onSelectOperation={handleStartGame} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <MathGame 
              operation={selectedOperation} 
              onExit={handleExitGame} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
