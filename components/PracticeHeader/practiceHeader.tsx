import { Button } from "../ui/button"

export const PracticeHeader = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button 
        variant="outline" 
        size="sm"
        className="hover:text-primary-foreground cursor-pointer">
          Sair
        </Button>
        <div className="text-center">
          <h1 className="font-bold text-2xl"> Sessão de Prática</h1>
          <p className="text-sm text-muted-foreground">Fase 1 de 6</p>
        </div>
        <div className="w-16" />
      </div>
    </div>
  );
};