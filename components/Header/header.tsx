import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DecisionButton } from '../DecisionButton/decisionButton';

export const Header = () => {
  return(
    <header>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-xl text-foreground">EnglishTalkAI</h1>
          </div>
          <DecisionButton>
            <Button variant="default" className="bg-primary hover:bg-primary/80 cursor-pointer font-bold">
              Comece
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DecisionButton>
        </div>
      </nav>
    </header>
  )
}
