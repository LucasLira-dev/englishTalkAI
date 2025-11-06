import { Button } from "../ui/button"
import { LogOut } from 'lucide-react'

export const PracticeHeader = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button 
        variant="outline" 
        size="sm"
        className="hover:text-primary-foreground cursor-pointer flex items-center">
          <LogOut className="w-4 h-4" />
        </Button>
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-2xl text-center"> Sessão de Prática</h1>
          <p className="text-sm text-muted-foreground text-center">Fase 1 de 6</p>
        </div>
        <div className="w-16" />
      </div>
    </div>
  );
};