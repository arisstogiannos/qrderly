"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { ArrowRight, Check } from "lucide-react"
import { useTranslations } from "next-intl"

export default function AnimatedStepper() {
  const steps = ["business setup", "menu settings", "generate items",  "publish"]
  const t = useTranslations("get started")

  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  // Extract current step from URL
  const urlSegments = pathname.split("/")
  const currentStepSlug = urlSegments[urlSegments.length - 1]

  // Find current step index
  const currentIndex = steps.findIndex((step) => step.replace(/\s+/g, "-") === currentStepSlug)
  const activeIndex = currentIndex >= 0 ? currentIndex : 0

  // Animation state
  const [animatedIndex, setAnimatedIndex] = useState(activeIndex)

  useEffect(() => {
    // Animate to the new index with a slight delay for visual effect
    const timer = setTimeout(() => {
      setAnimatedIndex(activeIndex)
    }, 100)

    // Scroll current step into view
    if (stepsRef.current[activeIndex]) {
      stepsRef.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }

    return () => clearTimeout(timer)
  }, [activeIndex])

  return (
    <div
      ref={containerRef}
      className="w-full xl:w-fit overflow-x-auto scrollbar-hidden py-4 px-2 mx-auto"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div className="flex items-center min-w-max mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            ref={(el) => {
              stepsRef.current[index] = el
            }}
            className="flex items-center"
          >
            {/* Step card */}
            <div
              className={cn(
                "relative flex items-center px-4 py-3 rounded-lg transition-all duration-500 mx-1",
                index === activeIndex
                  ? "bg-primary/10 border-2 border-primary shadow-md transform -translate-y-1"
                  : index < activeIndex
                    ? "bg-primary/5 border border-primary/30"
                    : "bg-gray-100 border border-gray-200",
                index === activeIndex ? "z-10" : "z-0",
              )}
              style={{
                minWidth: "120px",
                transform: index === activeIndex ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.5s ease, background-color 0.5s ease, border-color 0.5s ease",
              }}
            >
              {/* Step number/check */}
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full mr-3 transition-all duration-500",
                  index < activeIndex
                    ? "bg-primary text-white"
                    : index === activeIndex
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "bg-gray-200 text-gray-500",
                )}
              >
                {index < activeIndex ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {/* Step text */}
              <div className="flex-1">
                <p
                  className={cn(
                    "text-sm font-medium capitalize",
                    index === activeIndex ? "text-primary" : index < activeIndex ? "text-foreground" : "text-gray-500",
                  )}
                >
                  {t(step)}
                </p>
              </div>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex items-center justify-center w-8 transition-colors duration-500",
                  index < activeIndex ? "text-primary" : "text-gray-300",
                )}
              >
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
