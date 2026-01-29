import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResultsBySubject, useClearResultsBySubject } from "@/hooks/use-results";
import { BookOpen, PenTool, Users, MessageCircle, CircleDot, Shuffle, Trophy, History, Trash2, Home } from "lucide-react";
import { Link } from "wouter";

type Topic = 'grammar' | 'spelling' | 'agreement' | 'semantics' | 'punctuation' | 'random';

interface PortugueseMenuProps {
  onSelectTopic: (topic: Topic) => void;
}

const topicLabels: Record<Topic, string> = {
  grammar: 'Gramática',
  spelling: 'Ortografia',
  agreement: 'Concordância',
  semantics: 'Semântica',
  punctuation: 'Pontuação',
  random: 'Aleatório',
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function PortugueseMenu({ onSelectTopic }: PortugueseMenuProps) {
  const { data: results, isLoading } = useResultsBySubject('portuguese');
  const clearResults = useClearResultsBySubject();

  const topics = [
    { id: 'grammar' as const, label: 'Gramática', icon: BookOpen, color: 'bg-green-500', shadow: 'shadow-green-500/30' },
    { id: 'spelling' as const, label: 'Ortografia', icon: PenTool, color: 'bg-blue-500', shadow: 'shadow-blue-500/30' },
    { id: 'agreement' as const, label: 'Concordância', icon: Users, color: 'bg-purple-500', shadow: 'shadow-purple-500/30' },
    { id: 'semantics' as const, label: 'Semântica', icon: MessageCircle, color: 'bg-pink-500', shadow: 'shadow-pink-500/30' },
    { id: 'punctuation' as const, label: 'Pontuação', icon: CircleDot, color: 'bg-orange-500', shadow: 'shadow-orange-500/30' },
    { id: 'random' as const, label: 'Aleatório', icon: Shuffle, color: 'bg-gray-700', shadow: 'shadow-gray-700/30' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Home className="w-5 h-5" />
          </Button>
        </Link>
        <div className="text-center flex-1">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-foreground tracking-tight font-display"
          >
            <span className="text-green-500">Português</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground font-medium mt-2"
          >
            Identifique erros nas frases
          </motion.p>
        </div>
        <div className="w-10" />
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {topics.map((t) => (
          <motion.div key={t.id} variants={item}>
            <button
              onClick={() => onSelectTopic(t.id)}
              className={`w-full group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${t.shadow} bg-white border border-border/50 text-left`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${t.color} text-white mb-4 shadow-lg`}>
                <t.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-green-600 transition-colors">
                {t.label}
              </h3>
            </button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-3 gap-8"
      >
        <Card className="md:col-span-2 border-0 shadow-xl bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <History className="w-5 h-5 text-green-500" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4 mt-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-muted/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : results && results.length > 0 ? (
              <div className="space-y-3 mt-4">
                {results.slice(0, 5).map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-border/50">
                    <div>
                      <p className="font-bold text-sm">
                        {result.topic ? topicLabels[result.topic as Topic] : 'Português'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.createdAt!).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className={`font-black text-lg ${result.score >= 8 ? 'text-green-600' : 'text-foreground'}`}>
                      {result.score}/{result.totalQuestions}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma partida jogada ainda.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-teal-500 text-white overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-2">
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <Trophy className="w-5 h-5" />
              Estatísticas
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white hover:bg-white/10 cursor-pointer relative z-50"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.confirm('Zerar estatísticas de Português?')) {
                  clearResults.mutate('portuguese');
                }
              }}
              disabled={clearResults.isPending}
            >
              <Trash2 className="w-4 h-4 pointer-events-none" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Total de Partidas</p>
                <p className="text-4xl font-black">{results?.length || 0}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Média</p>
                <p className="text-4xl font-black">
                  {results && results.length > 0
                    ? Math.round(results.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions * 10), 0) / results.length * 10) / 10
                    : 0}
                  <span className="text-lg text-white/60 ml-1">/10</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
