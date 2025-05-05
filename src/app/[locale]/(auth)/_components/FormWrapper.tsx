import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";


export function FormWrapper({ title, subtitle, children }: { title: string, subtitle:string, children:ReactNode }) {
  return (
    <div className={"flex flex-col gap-6"} >
      <Card>
        <CardHeader>
          <CardTitle className="capitalize text-2xl">{title}</CardTitle>
          <CardDescription className=" md:pr-10 text-lg">
           {subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
