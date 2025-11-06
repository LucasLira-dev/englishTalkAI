import { Button } from "../ui/button";

export const MainCard = () => {
  
  const isListening = false;
  const isLoading = false;

    return (
        <div
        className="bg-primary-foreground flex flex-col gap-6 items-center justify-center p-6 border shadow-lg rounded-md min-w-full">
          <p
          className="text-sm">
            Ouça a frase: 
          </p>
          <div
          className="p-4 bg-chart-2/95 rounded-md text-primary-foreground w-full text-center">
            <p
            className="text-md font-bold">
              &quot;Hello, How are you?&quot;
            </p>  
          </div>
          <Button
          variant="outline" 
          className="w-full bg-transparent hover:bg-accent/80 hover:text-primary-foreground font-bold cursor-pointer">
            🔊
            Ouvir
          </Button>
          <p
          className="text-sm mt-8">
            Agora repita a frase
          </p>
          <div
          className="p-4 flex flex-col justify-center items-center shadow-md border border-gray-300 rounded-md w-full">
            <div className="text-center">
              <p className="text-2xl mb-2">🎤</p>
              <p className="text-sm text-muted-foreground">Clique para começar a falar</p>
            </div>
          </div>
          
          <div className="flex gap-4 w-full">
            {!isListening ? (
              <Button
              // onClick={handleStartListening}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              size="lg"
              >
                🎤 Comece a falar
              </Button>
            ) : (
              <Button
              // onClick={handleStopListening}
              // disabled={isLoading}
              className="flex-1 bg-accent hover:bg-accent/90"
              size="lg"
              >
                {isLoading ? "⏳ Analyzing..." : "⏹️ Stop & Analyze"}
              </Button>
            )}
          </div>
        </div>
    );
};