'use client'

import { Button } from "../ui/button"
import { DecisionButton } from "../DecisionButton/decisionButton"
import { useUserContext } from '@/shared/contexts/userContext';

export const CtaSection = () => {
  
  const { loading } = useUserContext();

  return(
    <section className="py-20 px-6 bg-primary-foreground">
      <div className="max-w-4xl mx-auto bg-linear-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/20 rounded-2xl p-12 text-center">
        <h3 className="text-3xl md:text-4xl font-display font-bold mb-4">Pronto para melhorar seu inglês?</h3>
        <p className="text-lg text-muted-foreground mb-8">
          Comece com uma sessão de prática gratuita e experimente o poder da aprendizagem guiada por IA.
        </p>
        <DecisionButton>
          <Button size="lg" className="bg-primary hover:bg-primary/90" disabled={loading}>
            Comece Agora
            <span className="ml-2">→</span>
          </Button>
        </DecisionButton>
      </div>
    </section>
  )
}