'use client';

import Link from "next/link";
import { DecisionButton } from "../../DecisionButton/decisionButton";
import { Button } from "../../ui/button";
import { useUserContext } from "@/shared/contexts/userContext";

export const MoreDetails = () => {
  
  const { loading } = useUserContext();
  
    return (
      <div
      className="flex flex-col sm:flex-row gap-4 justify-center">
        <DecisionButton>
          <Button
            className='bg-primary/80 flex gap-2 hover:bg-primary/70 font-bold cursor-pointer'
            variant="default"
            size="lg"
            disabled={loading}
          >
            <span className="mr-2">🎤</span>
            Comece a praticar
          </Button>
        </DecisionButton>
        
        <Link 
        href="/sobre">
          <Button
          className='bg-primary-foreground/90 border border-primary hover:bg-accent hover:border-accent hover:text-primary-foreground text-foreground text-center font-normal cursor-pointer w-full'
          >
            Saiba Mais
          </Button>
        </Link>
      </div>
    );
};