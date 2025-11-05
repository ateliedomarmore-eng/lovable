import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Tarefas() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Tarefas</h1>
            <p className="text-muted-foreground mt-1">Organize suas tarefas financeiras</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
