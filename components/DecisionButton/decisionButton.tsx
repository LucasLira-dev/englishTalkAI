'use client';

import Link from "next/link";
import { useUserContext } from "@/shared/contexts/userContext";

interface DecisionButtonProps {
  children: React.ReactNode;
}

export const DecisionButton = ({ children }: DecisionButtonProps) => {
  
  const { isAuthenticated } = useUserContext();
  
    return (
        <Link
          href={isAuthenticated ? '/pratique' : '/login'}>
          {children}
        </Link>
    );
};