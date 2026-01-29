import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResultsBySubject, useClearResultsBySubject } from "@/hooks/use-results";
import { MapPin, Globe, Map, Shuffle, Trophy, History, Trash2, Home } from "lucide-react";
import { Link } from "wouter";

type Topic = 'brazilCapitals' | 'worldCapitals' | 'continents' | 'random';

interface GeographyMenuProps {
  onSelectTopic: (topic: Topic) => void;
}

const topicLabels: Record<Topic, string> = {
  brazilCapitals: 'Capitais do Brasil',
  worldCapitals: 'Capitais do Mundo',
  continents: 'Continentes',
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

export function GeographyMenu({ onSelectTopic }: GeographyMenuProps) {
  const { data: results, isLoading } = useResultsBySubject('geography');
  const clearResults = useClearResultsBySubject();

  const topics = [
    { id: 'brazilCapitals' as const, label: 'Capitais do Brasil', icon: MapPin, color: 'bg-cyan-500', shadow: 'shadow-cyan-500/30', desc: 'Estados e suas capitais' },
    { id: 'worldCapitals' as const, label: 'Capitais do Mundo', icon: Globe, color: 'bg-blue-500', shadow: 'shadow-blue-500/30', desc: 'Países e suas capitais' },
    { id: 'continents' as const, label: 'Continentes', icon: Map, color: 'bg-green-500', shadow: 'shadow-green-500/30', desc: 'Onde fica cada país?' },
    { id: 'random' as const, label: 'Aleatório', icon: Shuffle, color: 'bg-gray-700', shadow: 'shadow-gray-700/30', desc: 'Mistura de tudo' },
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
            <span className="text-cyan-500">Geografia</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground font-medium mt-2"
          >
            Explore o mundo e aprenda sobre lugares
          </motion.p>
        </div>
        <div className="w-10" />
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
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
              <h3 className="text-lg font-bold text-foreground group-hover:text-cyan-600 transition-colors">
                {t.label}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
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
              <History className="w-5 h-5 text-cyan-500" />
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
                        {result.topic ? topicLabels[result.topic as Topic] : 'Geografia'}
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

        <Card className="border-0 shadow-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white overflow-hidden relative">
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
                if (window.confirm('Zerar estatísticas de Geografia?')) {
                  clearResults.mutate('geography');
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
