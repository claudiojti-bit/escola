import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useResults } from "@/hooks/use-results";
import { subjects, subjectLabels, type Subject } from "@shared/schema";
import { 
  Calculator, BookOpen, Globe, Landmark, SpellCheck,
  ChartBar, Home, AlertTriangle
} from "lucide-react";
import { Link } from "wouter";

const subjectIcons: Record<Subject, typeof Calculator> = {
  math: Calculator,
  preLiteracy: SpellCheck,
  portuguese: BookOpen,
  geography: Globe,
  history: Landmark,
};

const subjectColors: Record<Subject, string> = {
  math: 'bg-blue-500',
  preLiteracy: 'bg-yellow-500',
  portuguese: 'bg-green-500',
  geography: 'bg-cyan-500',
  history: 'bg-orange-500',
};

const topicLabels: Record<string, Record<string, string>> = {
  math: {
    addition: 'Adição',
    subtraction: 'Subtração',
    multiplication: 'Multiplicação',
    division: 'Divisão',
    geral: 'Geral',
  },
  preLiteracy: {
    firstLetter: 'Primeira Letra',
    completeWord: 'Complete a Palavra',
    soundMatch: 'Som Inicial',
    initialSyllable: 'Sílaba Inicial',
    geral: 'Geral',
  },
  portuguese: {
    grammar: 'Gramática',
    spelling: 'Ortografia',
    agreement: 'Concordância',
    semantics: 'Semântica',
    punctuation: 'Pontuação',
    random: 'Aleatório',
    geral: 'Geral',
  },
  geography: {
    brazilCapitals: 'Capitais do Brasil',
    worldCapitals: 'Capitais do Mundo',
    continents: 'Continentes',
    random: 'Aleatório',
    geral: 'Geral',
  },
  history: {
    brazil: 'História do Brasil',
    world: 'História Mundial',
    dates: 'Datas Importantes',
    random: 'Aleatório',
    geral: 'Geral',
  },
};

const getTopicLabel = (subject: Subject, topic: string): string => {
  return topicLabels[subject]?.[topic] || topic;
};

export default function StatsPage() {
  const { data: results, isLoading } = useResults();

  const getSubjectStats = (subject: Subject) => {
    if (!results) return { count: 0, avgScore: 0, topics: {} as Record<string, { count: number; avg: number }> };
    const subjectResults = results.filter(r => r.subject === subject);
    if (subjectResults.length === 0) return { count: 0, avgScore: 0, topics: {} };
    
    const avgScore = subjectResults.reduce((acc, r) => acc + (r.score / r.totalQuestions * 10), 0) / subjectResults.length;
    
    const topics: Record<string, { count: number; avg: number }> = {};
    subjectResults.forEach(r => {
      const topic = r.topic || 'geral';
      if (!topics[topic]) {
        topics[topic] = { count: 0, avg: 0 };
      }
      topics[topic].count++;
      topics[topic].avg += r.score / r.totalQuestions * 10;
    });
    
    Object.keys(topics).forEach(t => {
      topics[t].avg = Math.round(topics[t].avg / topics[t].count * 10) / 10;
    });
    
    return { count: subjectResults.length, avgScore: Math.round(avgScore * 10) / 10, topics };
  };

  const getWeakAreas = () => {
    const weakAreas: { subject: Subject; topic: string; avg: number }[] = [];
    
    subjects.forEach(subject => {
      const stats = getSubjectStats(subject);
      Object.entries(stats.topics).forEach(([topic, data]) => {
        if (data.avg < 7 && data.count >= 1) {
          weakAreas.push({ subject, topic, avg: data.avg });
        }
      });
    });
    
    return weakAreas.sort((a, b) => a.avg - b.avg).slice(0, 5);
  };

  const weakAreas = getWeakAreas();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-black text-foreground tracking-tight font-display"
            >
              Estatísticas <span className="text-primary">Detalhadas</span>
            </motion.h1>
          </div>
        </div>

        {weakAreas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <AlertTriangle className="w-5 h-5" />
                  Áreas para Melhorar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {weakAreas.map((area, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${subjectColors[area.subject]} flex items-center justify-center`}>
                          {(() => {
                            const Icon = subjectIcons[area.subject];
                            return <Icon className="w-4 h-4 text-white" />;
                          })()}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{subjectLabels[area.subject]}</p>
                          <p className="text-xs text-white/80">{getTopicLabel(area.subject, area.topic)}</p>
                        </div>
                      </div>
                      <span className="font-black text-lg">{area.avg}/10</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid gap-6">
          {subjects.map((subject) => {
            const stats = getSubjectStats(subject);
            const Icon = subjectIcons[subject];
            
            return (
              <motion.div
                key={subject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${subjectColors[subject]} flex items-center justify-center text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{subjectLabels[subject]}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {stats.count} partidas | Média: {stats.avgScore}/10
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(stats.topics).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(stats.topics).map(([topic, data]) => (
                          <div key={topic} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{getTopicLabel(subject, topic)}</span>
                              <span className={`${data.avg < 7 ? 'text-red-500' : 'text-green-600'} font-bold`}>
                                {data.avg}/10 ({data.count}x)
                              </span>
                            </div>
                            <Progress 
                              value={data.avg * 10} 
                              className="h-2"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        Nenhuma partida ainda. Comece a praticar!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
