import { useState } from "react";
import { HistoryGame } from "@/components/HistoryGame";
import { HistoryMenu } from "@/components/HistoryMenu";
import { AnimatePresence, motion } from "framer-motion";

type View = 'menu' | 'game';
type Topic = 'brazil' | 'world' | 'dates' | 'random';

export default function HistoryPage() {
  const [view, setView] = useState<View>('menu');
  const [selectedTopic, setSelectedTopic] = useState<Topic>('random');

  const handleStartGame = (topic: Topic) => {
    setSelectedTopic(topic);
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
            <HistoryMenu onSelectTopic={handleStartGame} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <HistoryGame 
              topic={selectedTopic} 
              onExit={handleExitGame} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
