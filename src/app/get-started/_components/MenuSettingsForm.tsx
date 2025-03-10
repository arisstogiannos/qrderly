"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useActionState } from "react";
import { submitMenuSettings } from "../actions";
import { ErrorMessage } from "@/components/Messages";

export default function MenuSettingsForm({
  businessId,
  subscriptionId
}: {
  businessId: string;
  subscriptionId:string
}) {
  const [state, action, isPending] = useActionState(
    submitMenuSettings.bind(null, businessId,subscriptionId),
    null
  );

  const colors = ["blue-400", "blue-600", "blue-800"];

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="grid gap-3">
        <Label htmlFor="languages">Languages</Label>
        <Input id="languages" name="language" type="text" required />
        {state?.errors?.language?.map((er) => {
          return (
            <ErrorMessage
              key={er}
              classNames="text-sm bg-transparent p-0 "
              msg={er}
            />
          );
        })}
      </div>
      <div className="grid gap-3">
        <div>
          <p>Theme</p>
          <p>
            Change the appearance of your menu by selecting between light, dark
            and custom themes for a more personalized look
          </p>
        </div>
        <div className="flex gap-2">
          {colors.map((color) => (
            <label key={color} className="cursor-pointer">
              <input
                type="radio"
                name="theme"
                value={color}
                className="hidden peer"
              />
              <div
                className={`size-20 rounded-3xl bg-${color} border-4 transition-all peer-checked:border-black border-transparent`}
              />
            </label>
          ))}
          {state?.errors?.theme?.map((er) => {
          return (
            <ErrorMessage
              key={er}
              classNames="text-sm bg-transparent p-0 "
              msg={er}
            />
          );
        })}
        </div>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="font">Font</Label>
        <Select name="font">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"restaurant"}>restaurant</SelectItem>
            <SelectItem value={"bar"}>bar</SelectItem>
            <SelectItem value={"cafeteria"}>cafeteria</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        disabled={isPending}
        type="submit"
        className="bg-foreground w-fit ml-auto text-lg rounded-full p-5"
      >
          Next <ArrowRight className="size-5" />
      </Button>
      {
              state?.error&&<ErrorMessage msg={state.error}/>
            }
    </form>
  );
}
