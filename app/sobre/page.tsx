"use client"

import { Button } from "@/components/ui/button"
import { Footer } from "@/components/Footer/footer"
import { Header } from "@/components/Header/header"
import { DecisionButton } from "@/components/DecisionButton/decisionButton"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-balance">Sobre EnglishTalkAI</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Revolucionando o aprendizado de inglês através de inteligência artificial e conversação interativa.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 border-t border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-4xl">🎯</span>
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">Nossa Missão</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa missão é tornar o aprendizado de inglês acessível, envolvente e eficaz para milhões de estudantes em todo o mundo, utilizando conversas interativas e inteligência artificial.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <span className="text-4xl">💡</span>
              </div>
              <h2 className="text-3xl font-display font-bold mb-4">Nossa Visão</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa visão é criar um mundo onde as barreiras linguísticas não limitem oportunidades. Estamos construindo a plataforma de aprendizado de inglês mais inteligente e personalizada, alimentada por tecnologia de IA de ponta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-display font-bold mb-12 text-center">Por que escolher EnglishTalkAI?</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "IA Personalizada",
                description: "Nossa IA avançada fornece feedback instantâneo sobre pronúncia, gramática e fluência.",
                icon: "🤖",
              },
              {
                title: "Conversas Reais",
                description: "Pratique inglês natural através de diálogos autênticos com nosso sistema interativo de IA.",
                icon: "💬",
              },
              {
                title: "Aprendizado Personalizado",
                description: "Aulas adaptativas que se ajustam ao seu nível e ritmo de aprendizado para o máximo de progresso.",
                icon: "📊",
              },
              {
                title: "Qualquer Hora, Qualquer Lugar",
                description: "Pratique onde e quando quiser. Sem aulas fixas. Apenas você e seu tutor de IA.",
                icon: "🌍",
              },
              {
                title: "Progress Tracking",
                description: "Monitor seu progresso com análises detalhadas e recomendações personalizadas.",
                icon: "📈",
              },
              {
                title: "Acesso Acessível",
                description: "Aprendizado de inglês de alta qualidade sem custos adicionais.",
                icon: "💰",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-display font-bold mb-12 text-center">How It Works</h2>

          <div className="space-y-8">
            {[
              { step: "1", title: "Login", description: "Crie sua conta com o Google em segundos." },
              {
                step: "2",
                title: "Ouça a frase",
                description: "Ouça a frase em inglês e pratique sua pronúncia.",
              },
              { step: "3", title: "Pratique", description: "Engage em atividades de prática para melhorar sua fluência." },
              { step: "4", title: "Receba Feedback", description: "Receba instantaneamente feedback sobre suas habilidades de fala." },
            ].map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground font-display font-bold">
                    {item.step}
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto bg-linear-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/20 rounded-2xl p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-4">Pronto para transformar o seu inglês?</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Junte-se a milhares de estudantes que já estão falando inglês com confiança.
          </p>
          <DecisionButton>
            <Button size="lg" className="bg-primary hover:bg-primary/90 cursor-pointer">
              Comece Agora
              <span className="ml-2">→</span>
            </Button>
          </DecisionButton>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
