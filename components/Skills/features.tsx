const cards = [
  {
    title: 'Ouça e Fale',
    description: 'Ouça frases em inglês naturais do nosso AI, depois pratique falando. Sua voz é reconhecida instantaneamente.',
    icon: '🎤'
  },
  {
    title: 'Feedback da IA',
    description: 'Receba feedback instantâneo sobre sua pronúncia e compreensibilidade.',
    icon: '✨'
  },
  {
    title: 'Melhora sua Pronúncia',
    description: 'Pratique falando frases em inglês e melhore sua pronúncia.',
    icon: '🚀'
  },
]

export const Features = () => {
  return(
    <section 
    className="py-20 px-6 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
           Como Funciona
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div key={index} className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl">{card.icon}</span>
              </div>
              <h4 className="font-display font-bold text-lg mb-3">{card.title}</h4>
              <p className="text-muted-foreground">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}