/* eslint-disable react-refresh/only-export-components */
import { createContext, useRef, type ReactNode } from "react";

export interface ModerationContextType {
  registerPendingApprovalRefetch: (refetch: () => void) => void;
  registerFlaggedContentRefetch: (refetch: () => void) => void;
  refetchAll: () => void;
}

export const ModerationContext = createContext<
  ModerationContextType | undefined
>(undefined);

interface ModerationProviderProps {
  children: ReactNode;
}

export function ModerationProvider({ children }: ModerationProviderProps) {
  const pendingApprovalRefetchRef = useRef<(() => void) | null>(null);
  const flaggedContentRefetchRef = useRef<(() => void) | null>(null);

  const registerPendingApprovalRefetch = (refetch: () => void) => {
    pendingApprovalRefetchRef.current = refetch;
  };

  const registerFlaggedContentRefetch = (refetch: () => void) => {
    flaggedContentRefetchRef.current = refetch;
  };

  const refetchAll = () => {
    pendingApprovalRefetchRef.current?.();
    flaggedContentRefetchRef.current?.();
  };

  return (
    <ModerationContext.Provider
      value={{
        registerPendingApprovalRefetch,
        registerFlaggedContentRefetch,
        refetchAll,
      }}
    >
      {children}
    </ModerationContext.Provider>
  );
}
