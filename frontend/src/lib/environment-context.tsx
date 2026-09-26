"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type EnvironmentType = "Production" | "Non-Prod";

type EnvironmentContextValue = {
  environment: EnvironmentType;
  setEnvironment: (env: EnvironmentType) => void;
};

const EnvironmentContext = createContext<EnvironmentContextValue>({
  environment: "Production",
  setEnvironment: () => {},
});

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironment] = useState<EnvironmentType>("Production");

  return (
    <EnvironmentContext.Provider value={{ environment, setEnvironment }}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  return useContext(EnvironmentContext);
}
