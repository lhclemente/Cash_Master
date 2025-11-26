import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { PlayerCard } from "@/components/PlayerCard";
import { StatusPanel } from "@/components/StatusPanel";
import { ActionButton } from "@/components/ActionButton";
import { LogPanel } from "@/components/LogPanel";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  PiggyBank, 
  TrendingUp, 
  Smartphone,
  Home,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Player {
  name: string;
  balance: number;
  savings: number;
  debt: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  player: string;
  action: string;
  amount?: number;
  type: "income" | "expense" | "info";
}

export default function GameBoard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [totalRounds, setTotalRounds] = useState(10);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const config = localStorage.getItem("gameConfig");
    if (!config) {
      navigate("/");
      return;
    }

    const { players: playerNames, rounds, initialBalance } = JSON.parse(config);
    setTotalRounds(rounds);
    setPlayers(
      playerNames.map((name: string) => ({
        name,
        balance: initialBalance,
        savings: 0,
        debt: 0,
      }))
    );

    addLog("info", "Todos", "Jogo iniciado!");
  }, [navigate]);

  const addLog = (type: LogEntry["type"], player: string, action: string, amount?: number) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString("pt-BR"),
      player,
      action,
      amount,
      type,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleAction = (actionType: string, amount: number) => {
    const player = players[currentPlayerIndex];
    const newPlayers = [...players];

    switch (actionType) {
      case "income":
        newPlayers[currentPlayerIndex].balance += amount;
        addLog("income", player.name, "Recebeu renda", amount);
        toast({
          title: "Dinheiro recebido!",
          description: `${player.name} recebeu R$ ${amount.toFixed(2)}`,
        });
        break;
      case "expense":
        newPlayers[currentPlayerIndex].balance -= amount;
        addLog("expense", player.name, "Fez uma compra", amount);
        toast({
          title: "Compra realizada",
          description: `${player.name} gastou R$ ${amount.toFixed(2)}`,
          variant: "destructive",
        });
        break;
      case "save":
        if (newPlayers[currentPlayerIndex].balance >= amount) {
          newPlayers[currentPlayerIndex].balance -= amount;
          newPlayers[currentPlayerIndex].savings += amount;
          addLog("info", player.name, "Depositou na poupança", amount);
          toast({
            title: "Poupança aumentada!",
            description: `${player.name} guardou R$ ${amount.toFixed(2)}`,
          });
        } else {
          toast({
            title: "Saldo insuficiente",
            description: "Você não tem dinheiro suficiente para poupar",
            variant: "destructive",
          });
          return;
        }
        break;
    }

    setPlayers(newPlayers);
    nextTurn();
  };

  const nextTurn = () => {
    if (currentPlayerIndex === players.length - 1) {
      if (currentRound === totalRounds) {
        setShowResults(true);
        addLog("info", "Todos", "Jogo finalizado!");
        return;
      }
      setCurrentRound(currentRound + 1);
      setCurrentPlayerIndex(0);
      addLog("info", "Todos", `Rodada ${currentRound + 1} iniciada`);
    } else {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    }
  };

  const exportResults = () => {
    const csv = [
      "Jogador,Saldo,Poupança,Empréstimo,Patrimônio Líquido",
      ...players.map(p => 
        `${p.name},${p.balance},${p.savings},${p.debt},${p.balance + p.savings - p.debt}`
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resultados-mercado-decisoes.csv";
    a.click();

    toast({
      title: "Resultados exportados!",
      description: "O arquivo CSV foi baixado com sucesso",
    });
  };

  const averageBalance = players.length > 0
    ? players.reduce((sum, p) => sum + p.balance, 0) / players.length
    : 0;

  if (players.length === 0) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StatusPanel
              currentRound={currentRound}
              totalRounds={totalRounds}
              totalPlayers={players.length}
              averageBalance={averageBalance}
            />

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Jogadores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {players.map((player, index) => (
                  <div key={player.name} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <PlayerCard
                      {...player}
                      isActive={index === currentPlayerIndex}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-strong p-6 rounded-lg">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Ações Disponíveis - {players[currentPlayerIndex]?.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <ActionButton
                  icon={TrendingUp}
                  label="Receber Renda"
                  description="Ganhe R$ 500"
                  variant="positive"
                  onClick={() => handleAction("income", 500)}
                />
                <ActionButton
                  icon={ShoppingCart}
                  label="Comprar Item"
                  description="Gaste R$ 200"
                  variant="negative"
                  onClick={() => handleAction("expense", 200)}
                />
                <ActionButton
                  icon={Smartphone}
                  label="Celular Novo"
                  description="Gaste R$ 800"
                  variant="negative"
                  onClick={() => handleAction("expense", 800)}
                />
                <ActionButton
                  icon={PiggyBank}
                  label="Poupar"
                  description="Guarde R$ 300"
                  variant="positive"
                  onClick={() => handleAction("save", 300)}
                />
                <ActionButton
                  icon={Home}
                  label="Aluguel"
                  description="Pague R$ 600"
                  variant="negative"
                  onClick={() => handleAction("expense", 600)}
                />
                <Button
                  variant="outline"
                  onClick={nextTurn}
                  className="h-auto p-4 bg-muted/50 hover:bg-muted border-border/50"
                >
                  <span className="font-semibold">Passar a Vez</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <LogPanel logs={logs} />
          </div>
        </div>
      </main>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="glass-strong border-primary/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              🎉 Jogo Finalizado!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Confira os resultados finais de todos os jogadores
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {players
              .map((p, i) => ({ ...p, index: i }))
              .sort((a, b) => 
                (b.balance + b.savings - b.debt) - (a.balance + a.savings - a.debt)
              )
              .map((player, position) => (
                <div
                  key={player.name}
                  className="p-4 rounded-lg bg-secondary/30 border border-border/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-primary">
                        #{position + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{player.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Saldo: R$ {player.balance.toFixed(2)} | 
                          Poupança: R$ {player.savings.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="text-xl font-bold text-success">
                        R$ {(player.balance + player.savings - player.debt).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={exportResults}
              variant="outline"
              className="flex-1 bg-primary/20 border-primary/40 text-primary hover:bg-primary/30"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Novo Jogo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
