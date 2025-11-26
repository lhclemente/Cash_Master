import { Coins } from "lucide-react";

export const Header = () => {
  return (
    <header className="glass-strong border-b border-border/40 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Coins className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Mercado de Decisões</h1>
            <p className="text-sm text-muted-foreground">Jogo Educacional Financeiro</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-muted-foreground">Aprenda jogando</p>
            <p className="text-sm font-medium text-foreground">Suas finanças em suas mãos</p>
          </div>
        </div>
      </div>
    </header>
  );
};
