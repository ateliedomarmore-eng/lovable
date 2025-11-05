import { NavLink, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Tag,
  CheckSquare,
  FileText,
  ChevronDown,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function Sidebar() {
  const [contasOpen, setContasOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  const menuItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/entradas", icon: TrendingUp, label: "Entradas" },
    { to: "/saidas", icon: TrendingDown, label: "Saídas" },
    { to: "/categorias", icon: Tag, label: "Categorias" },
    { to: "/tarefas", icon: CheckSquare, label: "Tarefas" },
  ];

  const contasItems = [
    { to: "/contas-pagar", label: "Contas a Pagar" },
    { to: "/contas-receber", label: "Contas a Receber" },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-foreground">
          FinanceDash
        </h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">
          Gestão Financeira
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "text-sidebar-foreground hover:bg-sidebar-accent",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-md"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div>
          <button
            onClick={() => setContasOpen(!contasOpen)}
            className={cn(
              "flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5" />
              <span>Contas</span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                contasOpen && "rotate-180"
              )}
            />
          </button>

          {contasOpen && (
            <div className="ml-4 mt-2 space-y-1">
              {contasItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "block px-4 py-2 rounded-lg text-sm transition-all duration-200",
                      "text-sidebar-foreground hover:bg-sidebar-accent",
                      isActive && "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <NavLink
          to="/configuracao"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              "text-sidebar-foreground hover:bg-sidebar-accent",
              isActive && "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-md"
            )
          }
        >
          <Settings className="w-5 h-5" />
          <span>Configuração</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </Button>
      </div>
    </aside>
  );
}
