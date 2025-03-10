import { cn } from "@/lib/utils";
import { CheckCircle2, TriangleAlertIcon } from "lucide-react";
import React from "react";

export function ErrorMessage({
  msg,
  classNames,
}: {
  msg: string;
  classNames?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-x-2 rounded-lg bg-destructive/20 p-3 text-destructive",
        classNames,
      )}
    >
      <TriangleAlertIcon size={"1.2em"} />
      {msg}
    </div>
  );
}
export function SuccessMessage({
  msg,
  classNames,
}: {
  msg: string;
  classNames?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-fit items-center gap-x-2 rounded-lg bg-green-500/15 p-3 text-green-700",
        classNames,
      )}
    >
      <CheckCircle2 size={"1.2em"} />
      {msg}
    </div>
  );
}
