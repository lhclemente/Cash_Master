import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Clock, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  timestamp: string;
  player: string;
  action: string;
  amount?: number;
  type: "income" | "expense" | "info";
}

interface LogPanelProps {
  logs: LogEntry[];
}

export const LogPanel = ({ logs }: LogPanelProps) => {
  const getIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "income":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "expense":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getAmountColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "income":
        return "text-success";
      case "expense":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="glass-strong p-4 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-lg text-foreground">Histórico de Ações</h3>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma ação registrada ainda</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-secondary/30 border border-border/30 animate-fade-in"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon(log.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {log.player}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {log.action}
                        </p>
                      </div>
                      {log.amount !== undefined && (
                        <span className={cn("font-bold text-sm", getAmountColor(log.type))}>
                          {log.type === "income" ? "+" : "-"}R$ {Math.abs(log.amount).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {log.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
