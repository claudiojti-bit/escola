import { useState } from "react";
import { PortugueseGame } from "@/components/PortugueseGame";
import { PortugueseMenu } from "@/components/PortugueseMenu";
import { AnimatePresence, motion } from "framer-motion";

type View = 'menu' | 'game';
type Topic = 'grammar' | 'spelling' | 'agreement' | 'semantics' | 'punctuation' | 'random';

export default function PortuguesePage() {
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
            <PortugueseMenu onSelectTopic={handleStartGame} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <PortugueseGame 
              topic={selectedTopic} 
              onExit={handleExitGame} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
