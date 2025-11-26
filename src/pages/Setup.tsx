import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Setup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [players, setPlayers] = useState<string[]>(["Jogador 1", "Jogador 2"]);
  const [rounds, setRounds] = useState(10);
  const [initialBalance, setInitialBalance] = useState(1000);

  const addPlayer = () => {
    if (players.length < 6) {
      setPlayers([...players, `Jogador ${players.length + 1}`]);
    } else {
      toast({
        title: "Limite atingido",
        description: "Máximo de 6 jogadores permitido",
        variant: "destructive",
      });
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Mínimo necessário",
        description: "É necessário no mínimo 2 jogadores",
        variant: "destructive",
      });
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const startGame = () => {
    if (players.some(p => !p.trim())) {
      toast({
        title: "Nome inválido",
        description: "Todos os jogadores precisam ter um nome",
        variant: "destructive",
      });
      return;
    }

    // Store game config in localStorage
    localStorage.setItem("gameConfig", JSON.stringify({
      players,
      rounds,
      initialBalance
    }));

    toast({
      title: "Jogo iniciado!",
      description: `${players.length} jogadores, ${rounds} rodadas`,
    });

    navigate("/game");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Configurar Novo Jogo
            </h1>
            <p className="text-muted-foreground text-lg">
              Configure os jogadores e as regras para começar a aprender sobre finanças
            </p>
          </div>

          <div className="space-y-6">
            <Card className="glass-strong p-6 animate-scale-in">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Jogadores
              </h2>
              
              <div className="space-y-3 mb-4">
                {players.map((player, index) => (
                  <div key={index} className="flex gap-2 animate-slide-up">
                    <div className="flex-1">
                      <Input
                        value={player}
                        onChange={(e) => updatePlayerName(index, e.target.value)}
                        placeholder={`Nome do jogador ${index + 1}`}
                        className="bg-secondary/50 border-border/50"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removePlayer(index)}
                      disabled={players.length <= 2}
                      className="bg-destructive/20 border-destructive/40 text-destructive hover:bg-destructive/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                onClick={addPlayer}
                disabled={players.length >= 6}
                variant="outline"
                className="w-full bg-primary/20 border-primary/40 text-primary hover:bg-primary/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Jogador
              </Button>
            </Card>

            <Card className="glass-strong p-6 animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Configurações do Jogo
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rounds" className="text-foreground">
                    Número de Rodadas
                  </Label>
                  <Input
                    id="rounds"
                    type="number"
                    min={5}
                    max={50}
                    value={rounds}
                    onChange={(e) => setRounds(parseInt(e.target.value) || 10)}
                    className="bg-secondary/50 border-border/50 mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recomendado: 10-20 rodadas
                  </p>
                </div>

                <div>
                  <Label htmlFor="balance" className="text-foreground">
                    Saldo Inicial (R$)
                  </Label>
                  <Input
                    id="balance"
                    type="number"
                    min={100}
                    max={10000}
                    step={100}
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(parseInt(e.target.value) || 1000)}
                    className="bg-secondary/50 border-border/50 mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Quanto cada jogador começa com
                  </p>
                </div>
              </div>
            </Card>

            <Button
              onClick={startGame}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-6 animate-pulse-glow"
            >
              <Play className="h-5 w-5 mr-2" />
              Iniciar Jogo
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
