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
import { EntradaModal } from "@/components/modals/EntradaModal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Entrada {
  id: string;
  description: string;
  amount: number;
  date: string;
  category_id: string | null;
  notes: string | null;
  categories?: { name: string; color: string } | null;
}

export default function Entradas() {
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntrada, setEditingEntrada] = useState<Entrada | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadEntradas();
  }, []);

  const loadEntradas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("entradas")
        .select("*, categories(name, color)")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setEntradas(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar entradas",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta entrada?")) return;

    try {
      const { error } = await supabase.from("entradas").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Entrada excluída com sucesso!",
      });
      loadEntradas();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir entrada",
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
            <h1 className="text-4xl font-bold text-foreground">Entradas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas receitas e ganhos
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingEntrada(null);
              setModalOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Entrada
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
              {entradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma entrada cadastrada. Clique em "Nova Entrada" para começar.
                  </TableCell>
                </TableRow>
              ) : (
                entradas.map((entrada) => (
                  <TableRow key={entrada.id}>
                    <TableCell>
                      {format(new Date(entrada.date), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="font-medium">{entrada.description}</TableCell>
                    <TableCell>
                      {entrada.categories && (
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${entrada.categories.color}20`,
                            color: entrada.categories.color,
                          }}
                        >
                          {entrada.categories.name}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-success">
                      {formatCurrency(entrada.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingEntrada(entrada);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entrada.id)}
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

      <EntradaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        entrada={editingEntrada}
        onSuccess={loadEntradas}
      />
    </MainLayout>
  );
}
