import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SaidaModal } from "@/components/modals/SaidaModal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Saida {
  id: string;
  description: string;
  amount: number;
  date: string;
  category_id: string | null;
  notes: string | null;
  categories?: { name: string; color: string } | null;
}

export default function Saidas() {
  const [saidas, setSaidas] = useState<Saida[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSaida, setEditingSaida] = useState<Saida | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSaidas();
  }, []);

  const loadSaidas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("saidas")
        .select("*, categories(name, color)")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setSaidas(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar saídas",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta saída?")) return;

    try {
      const { error } = await supabase.from("saidas").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Saída excluída com sucesso!",
      });
      loadSaidas();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir saída",
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Saídas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas despesas e gastos
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingSaida(null);
              setModalOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Saída
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {saidas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma saída cadastrada. Clique em "Nova Saída" para começar.
                  </TableCell>
                </TableRow>
              ) : (
                saidas.map((saida) => (
                  <TableRow key={saida.id}>
                    <TableCell>
                      {format(new Date(saida.date), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="font-medium">{saida.description}</TableCell>
                    <TableCell>
                      {saida.categories && (
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${saida.categories.color}20`,
                            color: saida.categories.color,
                          }}
                        >
                          {saida.categories.name}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-destructive">
                      {formatCurrency(saida.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingSaida(saida);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(saida.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <SaidaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        saida={editingSaida}
        onSuccess={loadSaidas}
      />
    </MainLayout>
  );
}
