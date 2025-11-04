import { Header } from '../components/Header/header';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main
    className="min-h-screen bg-background">
      <Header />
      <section
      className="flex flex-col items-center justify-center py-24">
        <div
         className='flex gap-2 rounded-3xl py-2 px-6 bg-muted-foreground/20 border-ring max-w-sm'>
          <Sparkles className="w-6 h-6 text-chart-5" />
          <span
            className="text-accent font-bold">
            Prática poderosa com IA
          </span>
        </div>
      </section>
    </main>
  );
}
