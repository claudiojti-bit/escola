import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResultsBySubject, useClearResultsBySubject } from "@/hooks/use-results";
import { Plus, Minus, X, Divide, Trophy, History, Trash2, Home } from "lucide-react";
import { Link } from "wouter";

type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

interface MathMenuProps {
  onSelectOperation: (op: Operation) => void;
}

const operationLabels: Record<Operation, string> = {
  addition: 'Adição',
  subtraction: 'Subtração',
  multiplication: 'Multiplicação',
  division: 'Divisão',
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function MathMenu({ onSelectOperation }: MathMenuProps) {
  const { data: results, isLoading } = useResultsBySubject('math');
  const clearResults = useClearResultsBySubject();

  const operations = [
    { id: 'addition' as const, label: 'Adição', icon: Plus, color: 'bg-blue-500', shadow: 'shadow-blue-500/30' },
    { id: 'subtraction' as const, label: 'Subtração', icon: Minus, color: 'bg-green-500', shadow: 'shadow-green-500/30' },
    { id: 'multiplication' as const, label: 'Multiplicação', icon: X, color: 'bg-purple-500', shadow: 'shadow-purple-500/30' },
    { id: 'division' as const, label: 'Divisão', icon: Divide, color: 'bg-pink-500', shadow: 'shadow-pink-500/30' },
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
            className="text-5xl md:text-7xl font-black text-foreground tracking-tight font-display"
          >
            Matemática <span className="text-primary">Divertida</span>!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground font-medium mt-2"
          >
            Escolha uma operação para praticar
          </motion.p>
        </div>
        <div className="w-10" />
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {operations.map((op) => (
          <motion.div key={op.id} variants={item}>
            <button
              onClick={() => onSelectOperation(op.id)}
              className={`w-full group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${op.shadow} bg-white border border-border/50 text-left`}
              data-testid={`button-operation-${op.id}`}
            >
              <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <op.icon className="w-32 h-32 transform rotate-12" />
              </div>
              
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${op.color} text-white mb-6 shadow-lg`}>
                <op.icon className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {op.label}
              </h3>
              <p className="text-muted-foreground font-medium">
                Praticar {op.label.toLowerCase()}
              </p>
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
              <History className="w-5 h-5 text-primary" />
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
                  <div key={result.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-border/50 hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                        ${result.topic === 'addition' ? 'bg-blue-500' : 
                          result.topic === 'subtraction' ? 'bg-green-500' :
                          result.topic === 'multiplication' ? 'bg-purple-500' : 'bg-pink-500'}`
                      }>
                        {result.topic === 'addition' ? '+' : 
                         result.topic === 'subtraction' ? '-' :
                         result.topic === 'multiplication' ? '×' : '÷'}
                      </div>
                      <div>
                        <p className="font-bold capitalize text-sm">
                          {result.topic ? operationLabels[result.topic as Operation] : 'Matemática'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(result.createdAt!).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-lg ${result.score >= 8 ? 'text-green-600' : 'text-foreground'}`}>
                        {result.score}/{result.totalQuestions}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma partida jogada ainda. Comece a praticar!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-primary to-purple-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-2">
            <CardTitle className="flex items-center gap-2 text-xl text-white">
              <Trophy className="w-5 h-5" />
              Suas Estatísticas
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white hover:bg-white/10 cursor-pointer relative z-50"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.confirm('Tem certeza que deseja zerar as estatísticas de Matemática?')) {
                  clearResults.mutate('math');
                }
              }}
              disabled={clearResults.isPending}
              data-testid="button-clear-math-stats"
            >
              <Trash2 className="w-4 h-4 pointer-events-none" />
            </Button>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-6">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Total de Partidas</p>
                <p className="text-4xl font-black">{results?.length || 0}</p>
              </div>
              
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Média de Pontuação</p>
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
