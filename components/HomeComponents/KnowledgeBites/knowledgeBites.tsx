const cards = [
  {
    title: "5 Min",
    description: "Lições diariamente",
    style: "text-accent font-bold"
  },
  {
    title: "95%",
    description: "Nivel de satisfação",
    style: "text-accent font-bold"
  },
  {
    title: "1+",
    description: "Estudantes aprendendo",
    style: "text-primary font-bold"
  }
];

export const KnowledgeBites = () => {
  return (
    <section
    className="flex flex-row justify-center mt-10">
      <div
      className="grid md:grid-cols-3 gap-8">
        { cards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-primary-foreground/60 border border-primary-foreground p-4 text-2xl rounded-lg shadow-lg">
            <span 
            className={card.style}>
              {card.title}
            </span>
            <span
              className="text-muted-foreground text-[14px] text-center">
              {card.description}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};