"use client";
import { usePlanContext } from "./PlanContext";

export function Switch() {
  const { selectedPlanType, setSelectedPlanType } = usePlanContext();
  return (
    <div className="relative  bg-background w-fit rounded-full px-1 py-1">
      <div className="relative w-full h-full">
        <div
          className={`absolute w-1/2 h-full bg-primary rounded-full top-1/2 transform -translate-y-1/2 transition-all duration-500 ${
            selectedPlanType === "yearly" ? "left-0" : "left-1/2"
          }`}
        ></div>
        <div className=" grid grid-cols-2 gap-20 items-center text-lg bg-background w-fit rounded-full px-6 py-2">
          <button
            className={`z-10 text-center cursor-pointer transition-colors duration-300 delay-75 ${
              selectedPlanType === "yearly" ? "text-background" : "text-foreground"
            }`}
            onClick={() => setSelectedPlanType("yearly")}
          >
            Yearly (save 20%)
          </button>
          <button
            className={`z-10 text-center cursor-pointer transition-colors duration-300 delay-75 ${
              selectedPlanType === "monthly" ? "text-background" : "text-foreground"
            }`}
            onClick={() => setSelectedPlanType("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>
    </div>
  );
}
