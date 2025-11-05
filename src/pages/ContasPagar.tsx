import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ContasPagar() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Contas a Pagar</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas contas pendentes</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Conta a Pagar
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
