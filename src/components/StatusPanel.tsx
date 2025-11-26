import { Calendar, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatusPanelProps {
  currentRound: number;
  totalRounds: number;
  totalPlayers: number;
  averageBalance: number;
}

export const StatusPanel = ({ 
  currentRound, 
  totalRounds, 
  totalPlayers, 
  averageBalance 
}: StatusPanelProps) => {
  const progress = (currentRound / totalRounds) * 100;

  return (
    <Card className="glass-strong p-6">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        Status do Jogo
      </h2>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Rodada</span>
            </div>
            <span className="font-semibold text-foreground">
              {currentRound} / {totalRounds}
            </span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Jogadores</span>
            </div>
            <p className="font-bold text-lg text-foreground">{totalPlayers}</p>
          </div>

          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Média</span>
            </div>
            <p className="font-bold text-lg text-foreground">
              R$ {averageBalance.toFixed(0)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
