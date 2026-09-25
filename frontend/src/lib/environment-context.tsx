"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type EnvironmentType = "Cluster" | "Database";

type EnvironmentContextValue = {
  environment: EnvironmentType;
  setEnvironment: (env: EnvironmentType) => void;
};

const EnvironmentContext = createContext<EnvironmentContextValue>({
  environment: "Cluster",
  setEnvironment: () => {},
});

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironment] = useState<EnvironmentType>("Cluster");

  return (
    <EnvironmentContext.Provider value={{ environment, setEnvironment }}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  return useContext(EnvironmentContext);
}
