import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useResults, useClearResults } from "@/hooks/use-results";
import { subjects, subjectLabels, type Subject } from "@shared/schema";
import { 
  Calculator, BookOpen, Globe, Landmark, SpellCheck,
  Trophy, ChartBar, Trash2, ArrowRight
} from "lucide-react";
import { Link } from "wouter";

const subjectIcons: Record<Subject, typeof Calculator> = {
  math: Calculator,
  preLiteracy: SpellCheck,
  portuguese: BookOpen,
  geography: Globe,
  history: Landmark,
};

const subjectColors: Record<Subject, { bg: string; shadow: string }> = {
  math: { bg: 'bg-blue-500', shadow: 'shadow-blue-500/30' },
  preLiteracy: { bg: 'bg-yellow-500', shadow: 'shadow-yellow-500/30' },
  portuguese: { bg: 'bg-green-500', shadow: 'shadow-green-500/30' },
  geography: { bg: 'bg-cyan-500', shadow: 'shadow-cyan-500/30' },
  history: { bg: 'bg-orange-500', shadow: 'shadow-orange-500/30' },
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

export default function Home() {
  const { data: results, isLoading } = useResults();
  const clearResults = useClearResults();

  const getSubjectStats = (subject: Subject) => {
    if (!results) return { count: 0, avgScore: 0 };
    const subjectResults = results.filter(r => r.subject === subject);
    if (subjectResults.length === 0) return { count: 0, avgScore: 0 };
    const avgScore = subjectResults.reduce((acc, r) => acc + (r.score / r.totalQuestions * 10), 0) / subjectResults.length;
    return { count: subjectResults.length, avgScore: Math.round(avgScore * 10) / 10 };
  };

  const totalGames = results?.length || 0;
  const overallAvg = results && results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + (r.score / r.totalQuestions * 10), 0) / results.length * 10) / 10
    : 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-foreground tracking-tight font-display"
          >
            Aprendizado <span className="text-primary">Divertido</span>!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground font-medium"
          >
            Escolha uma matéria e comece a praticar
          </motion.p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {subjects.map((subject) => {
            const Icon = subjectIcons[subject];
            const colors = subjectColors[subject];
            const stats = getSubjectStats(subject);
            
            return (
              <motion.div key={subject} variants={item}>
                <Link href={`/${subject}`}>
                  <button
                    className={`w-full group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${colors.shadow} bg-white border border-border/50 text-left`}
                    data-testid={`button-subject-${subject}`}
                  >
                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                      <Icon className="w-20 h-20 transform rotate-12" />
                    </div>
                    
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} text-white mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {subjectLabels[subject]}
                    </h3>
                    
                    {stats.count > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Média: <span className="font-bold text-foreground">{stats.avgScore}/10</span>
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Comece agora!
                      </p>
                    )}
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-primary to-purple-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-2">
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <Trophy className="w-5 h-5" />
                Estatísticas Gerais
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-white hover:bg-white/10 cursor-pointer relative z-50"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (window.confirm('Tem certeza que deseja zerar TODAS as estatísticas?')) {
                    clearResults.mutate();
                  }
                }}
                disabled={clearResults.isPending}
                data-testid="button-clear-all-stats"
              >
                <Trash2 className="w-4 h-4 pointer-events-none" />
              </Button>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">Total de Partidas</p>
                  <p className="text-4xl font-black" data-testid="text-total-games">{totalGames}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">Média Geral</p>
                  <p className="text-4xl font-black" data-testid="text-overall-avg">
                    {overallAvg}
                    <span className="text-lg text-white/60 ml-1">/10</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ChartBar className="w-5 h-5 text-primary" />
                Desempenho por Matéria
              </CardTitle>
              <Link href="/stats">
                <Button variant="ghost" size="sm" className="text-primary" data-testid="button-detail-stats">
                  Detalhar <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjects.map((subject) => {
                  const stats = getSubjectStats(subject);
                  
                  return (
                    <div key={subject} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{subjectLabels[subject]}</span>
                        <span className="text-muted-foreground">
                          {stats.count > 0 ? `${stats.avgScore}/10` : '-'}
                        </span>
                      </div>
                      <Progress 
                        value={stats.avgScore * 10} 
                        className="h-2"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
