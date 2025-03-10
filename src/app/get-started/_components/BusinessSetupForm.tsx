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
import React, { useActionState, useState } from "react";
import { submitBusinessInfo } from "../actions";
import { ErrorMessage } from "@/components/Messages";

export default function BusinessSetupForm() {
  const [state, action, isPending] = useActionState(submitBusinessInfo, null);
  //   const [formData,setFormData] = useState({

  //   })

  //   function handleChange(){

  //   }

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="grid gap-3">
        <Label htmlFor="name">Business Name</Label>
        <Label htmlFor="name" className="text-sm text-muted-foreground">It will be used as a url for your menu. Example: qrderly.io/mybusiness/menu</Label>
        <Input id="name" name="name" type="text" required />
        {state?.errors?.name?.map((er) => {
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
        <Label htmlFor="type">Business Type</Label>
        <Select name="type" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose your business type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"restaurant"}>restaurant</SelectItem>
            <SelectItem value={"bar"}>bar</SelectItem>
            <SelectItem value={"cafeteria"}>cafeteria</SelectItem>
          </SelectContent>
        </Select>
        {state?.errors?.type?.map((er) => {
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
        <Label htmlFor="country">Country</Label>
        <Input id="country" name="country" type="text" required />
        {state?.errors?.country?.map((er) => {
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
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" type="text" required />
        {state?.errors?.city?.map((er) => {
          return (
            <ErrorMessage
              key={er}
              classNames="text-sm bg-transparent p-0 "
              msg={er}
            />
          );
        })}
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
