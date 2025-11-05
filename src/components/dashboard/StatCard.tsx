import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "income" | "expense" | "receivable" | "payable";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "income",
}: StatCardProps) {
  const variantStyles = {
    income: "border-l-4 border-l-success",
    expense: "border-l-4 border-l-destructive",
    receivable: "border-l-4 border-l-primary",
    payable: "border-l-4 border-l-warning",
  };

  const iconStyles = {
    income: "text-success bg-success/10",
    expense: "text-destructive bg-destructive/10",
    receivable: "text-primary bg-primary/10",
    payable: "text-warning bg-warning/10",
  };

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all duration-300 cursor-pointer",
        variantStyles[variant]
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div
            className={cn(
              "p-3 rounded-xl",
              iconStyles[variant]
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
