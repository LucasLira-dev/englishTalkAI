import { Button } from '@/components/ui/button';
import { Header } from '../components/Header/header';
import { Sparkles } from 'lucide-react';
import { KnowledgeBites } from '@/components/KnowledgeBites/knowledgeBites';
import { Features } from '@/components/Skills/features';
import { CtaSection } from '@/components/CtaSection/ctaSection';
import { Footer } from '@/components/Footer/footer';

export default function Home() {
  return (
    <>
    <Header />
    <main
    className="min-h-screen bg-background">
      <section
      className="flex flex-col items-center justify-center py-24 mt-8 md:mt-12 lg:mt-16 bg-primary-foreground">
        <div
         className='flex gap-2 rounded-3xl py-2 px-6 bg-muted-foreground/20 border-ring max-w-sm'>
          <Sparkles className="w-6 h-6 text-chart-5" />
          <span
            className="text-accent font-bold">
            Prática poderosa com IA
          </span>
        </div>
        <div
        className='flex flex-col items-center justify-center p-4 gap-5'>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-balance text-center">
            Fale Inglês{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Naturalmente
            </span>
          </h2>
          <p
          className="text-lg md:text-xl text-muted-foreground text-center">
            Pratique conversação em inglês com um inteligente assistente virtual. Receba feedback instantâneo e melhore sua fluência.
          </p>
          <div
          className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
            className='bg-primary/80 flex gap-2 hover:bg-primary/70 font-bold cursor-pointer'
            variant="default"
            size="lg">
              <span className="mr-2">🎤</span>
              Comece a praticar
            </Button>
            <Button
            className='bg-primary-foreground/90 border border-primary hover:bg-accent hover:border-accent hover:text-primary-foreground text-foreground text-center font-normal cursor-pointer w-full'
            variant="default"
            size="lg">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>
      <KnowledgeBites />
      <Features />
      <CtaSection />
    </main>
    <Footer />
    </>
  );
}
