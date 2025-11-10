import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { logout } from "../../shared/firebase";
import { useRouter } from "next/navigation";

export const PracticeHeader = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="outline"
          size="sm"
          className="hover:text-primary-foreground cursor-pointer flex items-center"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
        </Button>
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-2xl text-center"> Sessão de Prática</h1>
        </div>
        <div className="w-16" />
      </div>
    </div>
  );
};
