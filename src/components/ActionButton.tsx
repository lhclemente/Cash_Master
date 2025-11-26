import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  description: string;
  variant?: "positive" | "negative" | "neutral";
  onClick: () => void;
  disabled?: boolean;
}

export const ActionButton = ({ 
  icon: Icon, 
  label, 
  description, 
  variant = "neutral",
  onClick,
  disabled 
}: ActionButtonProps) => {
  const variantStyles = {
    positive: "bg-success/20 hover:bg-success/30 border-success/40 text-success hover:scale-105",
    negative: "bg-destructive/20 hover:bg-destructive/30 border-destructive/40 text-destructive hover:scale-105",
    neutral: "bg-accent/20 hover:bg-accent/30 border-accent/40 text-accent hover:scale-105"
  };

  return (
    <Button
      variant="outline"
      className={cn(
        "h-auto p-4 flex flex-col items-start gap-2 transition-all duration-300 glass border-2",
        variantStyles[variant],
        disabled && "opacity-50 cursor-not-allowed hover:scale-100"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center gap-2 w-full">
        <Icon className="h-5 w-5" />
        <span className="font-semibold text-base">{label}</span>
      </div>
      <span className="text-xs opacity-80 text-left">{description}</span>
    </Button>
  );
};
