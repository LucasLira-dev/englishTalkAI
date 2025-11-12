import { Button } from "@/components/ui/button";

interface PlayAudioButtonProps {
  currentSentence: string | null;
  isProcessing: boolean;
  playAudio: () => Promise<void>;
}

export const PlayAudioButton = ({ currentSentence, isProcessing, playAudio }: PlayAudioButtonProps) => {
   
  return (
    <Button
      onClick={playAudio}
      variant="outline"
      className="w-full bg-transparent hover:bg-accent/80 hover:text-primary-foreground font-bold cursor-pointer"
      disabled={!currentSentence || isProcessing}
    >
      {isProcessing ? (
        <div className="flex items-center gap-2">
          <span className="inline-block animate-sway">🔊</span>
          <span>Carregando áudio...</span>
        </div>
      ) : (
        "🔊 Ouvir"
      )}
    </Button>
  );
};