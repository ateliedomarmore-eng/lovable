import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  type?: "contas_pagar" | "contas_receber";
}

export function StatusBadge({ status, type = "contas_pagar" }: StatusBadgeProps) {
  const getStatusConfig = () => {
    if (type === "contas_pagar") {
      switch (status) {
        case "pago":
          return {
            label: "Pago",
            className: "bg-success/10 text-success hover:bg-success/20 border-success/20",
          };
        case "vencido":
          return {
            label: "Vencido",
            className: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
          };
        case "a_vencer":
          return {
            label: "A Vencer",
            className: "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20",
          };
        default:
          return {
            label: status,
            className: "",
          };
      }
    } else {
      switch (status) {
        case "recebido":
          return {
            label: "Recebido",
            className: "bg-success/10 text-success hover:bg-success/20 border-success/20",
          };
        case "atrasado":
          return {
            label: "Atrasado",
            className: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
          };
        case "a_receber":
          return {
            label: "A Receber",
            className: "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20",
          };
        default:
          return {
            label: status,
            className: "",
          };
      }
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
