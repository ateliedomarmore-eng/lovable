import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { TrendingUp, TrendingDown, FileText, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEntradas: 0,
    totalSaidas: 0,
    contasPagar: { total: 0, count: 0 },
    contasReceber: { total: 0, count: 0 },
  });
  const { toast } = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get entradas
      const { data: entradas, error: entradasError } = await supabase
        .from("entradas")
        .select("amount")
        .eq("user_id", user.id);

      if (entradasError) throw entradasError;

      // Get saidas
      const { data: saidas, error: saidasError } = await supabase
        .from("saidas")
        .select("amount")
        .eq("user_id", user.id);

      if (saidasError) throw saidasError;

      // Get contas a pagar
      const { data: contasPagar, error: contasPagarError } = await supabase
        .from("contas_pagar")
        .select("amount")
        .eq("user_id", user.id)
        .neq("status", "pago");

      if (contasPagarError) throw contasPagarError;

      // Get contas a receber
      const { data: contasReceber, error: contasReceberError } = await supabase
        .from("contas_receber")
        .select("amount")
        .eq("user_id", user.id)
        .neq("status", "recebido");

      if (contasReceberError) throw contasReceberError;

      setStats({
        totalEntradas: entradas?.reduce((sum, e) => sum + Number(e.amount), 0) || 0,
        totalSaidas: saidas?.reduce((sum, s) => sum + Number(s.amount), 0) || 0,
        contasPagar: {
          total: contasPagar?.reduce((sum, c) => sum + Number(c.amount), 0) || 0,
          count: contasPagar?.length || 0,
        },
        contasReceber: {
          total: contasReceber?.reduce((sum, c) => sum + Number(c.amount), 0) || 0,
          count: contasReceber?.length || 0,
        },
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar estatísticas",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das suas finanças
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Entradas"
            value={formatCurrency(stats.totalEntradas)}
            icon={TrendingUp}
            variant="income"
          />
          <StatCard
            title="Saídas"
            value={formatCurrency(stats.totalSaidas)}
            icon={TrendingDown}
            variant="expense"
          />
          <StatCard
            title="Contas a Pagar"
            value={formatCurrency(stats.contasPagar.total)}
            subtitle={`${stats.contasPagar.count} contas`}
            icon={FileText}
            variant="payable"
          />
          <StatCard
            title="Contas a Receber"
            value={formatCurrency(stats.contasReceber.total)}
            subtitle={`${stats.contasReceber.count} contas`}
            icon={DollarSign}
            variant="receivable"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-foreground">
              Resumo Mensal
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Total de Entradas</span>
                <span className="font-bold text-success">
                  {formatCurrency(stats.totalEntradas)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Total de Saídas</span>
                <span className="font-bold text-destructive">
                  {formatCurrency(stats.totalSaidas)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border-2 border-primary">
                <span className="font-semibold text-foreground">Saldo</span>
                <span className="font-bold text-primary text-lg">
                  {formatCurrency(stats.totalEntradas - stats.totalSaidas)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-foreground">
              Contas Pendentes
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">A Pagar</span>
                <div className="text-right">
                  <span className="font-bold text-warning block">
                    {formatCurrency(stats.contasPagar.total)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stats.contasPagar.count} contas
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">A Receber</span>
                <div className="text-right">
                  <span className="font-bold text-success block">
                    {formatCurrency(stats.contasReceber.total)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stats.contasReceber.count} contas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
