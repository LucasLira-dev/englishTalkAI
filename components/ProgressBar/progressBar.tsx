interface ProgressBarProps {
  sessionProgress: number;
}

export const ProgressBar = ({ sessionProgress }: ProgressBarProps) => {
  return (
    <div
    className="mb-8">
      <div
      className="flex gap-2">
        {
          Array.from({length: 6}).map((_, index) => (
            <div
            key={index}
            className={`flex-1 h-2 rounded-full transition-colors ${
              index < sessionProgress ? "bg-primary" : "bg-border"
            }`} />
          ))
        }
      </div>
    </div>
  );
};
