"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

type PlanContextType = {
  selectedPlanType: "yearly" | "monthly";
  setSelectedPlanType: (type: "yearly" | "monthly") => void;
};

type selectedPlanType="yearly" | "monthly"

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPlanType, setSelectedPlanType] = useState<selectedPlanType>("yearly");

  return (
    <PlanContext.Provider value={{ selectedPlanType, setSelectedPlanType }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlanContext must be used within a PlanProvider");
  }
  return context;
};