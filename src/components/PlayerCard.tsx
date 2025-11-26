import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  name: string;
  balance: number;
  savings: number;
  debt: number;
  isActive?: boolean;
}

export const PlayerCard = ({ name, balance, savings, debt, isActive }: PlayerCardProps) => {
  const netWorth = balance + savings - debt;
  const isPositive = netWorth >= 0;

  return (
    <Card className={cn(
      "glass p-4 transition-all duration-300 hover:scale-[1.02]",
      isActive && "ring-2 ring-primary shadow-lg shadow-primary/20"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground">{name}</h3>
          <p className="text-xs text-muted-foreground">Jogador Ativo</p>
        </div>
        {isActive && (
          <Badge className="bg-primary/20 text-primary border-primary/30">
            Sua vez
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Saldo</span>
          </div>
          <span className="font-bold text-lg text-foreground">
            R$ {balance.toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-xs text-success/80">Poupança</span>
            </div>
            <p className="font-semibold text-sm text-success">
              R$ {savings.toFixed(2)}
            </p>
          </div>

          <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-1 mb-1">
              <TrendingDown className="h-3 w-3 text-destructive" />
              <span className="text-xs text-destructive/80">Empréstimo</span>
            </div>
            <p className="font-semibold text-sm text-destructive">
              R$ {debt.toFixed(2)}
            </p>
          </div>
        </div>

        <div className={cn(
          "p-3 rounded-lg border-2 transition-colors",
          isPositive 
            ? "bg-success/5 border-success/30" 
            : "bg-destructive/5 border-destructive/30"
        )}>
          <p className="text-xs text-muted-foreground mb-1">Patrimônio Líquido</p>
          <p className={cn(
            "font-bold text-xl",
            isPositive ? "text-success" : "text-destructive"
          )}>
            R$ {netWorth.toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
};
