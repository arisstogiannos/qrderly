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
import React, { useActionState, useEffect, useState } from "react";
import { submitBusinessInfo } from "../../actions";
import { ErrorMessage } from "@/components/Messages";
import { redirect, useRouter } from "next/navigation";
import { ProductURL } from "@/types";
import Loader from "@/components/Loader";
import { Checkbox } from "@/components/ui/checkbox";
import TablesSetup from "./TablesSetup";

export default function BusinessSetupForm({
  product,
}: {
  product: ProductURL;
}) {
  const [state, action, isPending] = useActionState(
    submitBusinessInfo.bind(null, product),
    null
  );
  //   const [formData,setFormData] = useState({
  // const router = useRouter()

  // if(state?.success){
  //   router.push("/get-started/"+product+"/menu-settings")
  // }

  return (
    <form action={action} className="flex flex-col gap-6 max-w-3xl">
      <div className="grid gap-3">
        <div className="space-y-1">
          <Label htmlFor="name">Business Name</Label>
          <p className="text-sm text-muted-foreground">
            It will be used as a url for your menu. Example:
            qrderly.io/mybusiness/menu
          </p>
        </div>
        <Input
          pattern="[^-]*" // Disallows "_"
          title="Underscore (-) is not allowed"
          id="name"
          name="name"
          type="text"
          required
        />
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
      {product === "smart-ordering-qr-menu" && (
        <div className="grid gap-3">
          <TablesSetup />
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
      )}

      <Button
        disabled={isPending}
        type="submit"
        className="bg-foreground w-fit ml-auto text-lg rounded-full p-1 min-w-24"
      >
        {isPending ? (
          <Loader />
        ) : (
          <>
            Next <ArrowRight className="size-5" />
          </>
        )}
      </Button>
      {state?.error && <ErrorMessage msg={state.error} />}
    </form>
  );
}

