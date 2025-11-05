import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Configuracao() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-1">Personalize sua experiência</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
