"use client";
import Loader from "@/components/Loader";
import { ErrorMessage, SuccessMessage } from "@/components/Messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { productsData } from "@/data";
import { sendContactEmail } from "@/email/mail";
import React, { useActionState } from "react";

export default function ContactForm() {
  const [state, action, isPending] = useActionState(sendContactEmail, null);
  return (
    <div className="max-w-xl lg:min-w-xl bg-background p-6 rounded-3xl outline-2 outline-primary/10">
      <form action={action}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="fullname">Full Name</Label>
            <Input id="fullname" name="fullName" defaultValue={state?.rawData?.fullName} type="fullname" required />
            {state?.errors?.fullName?.map((er) => {
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" defaultValue={state?.rawData?.email} type="email" required />
            {state?.errors?.email?.map((er) => {
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
            <Label htmlFor="product">Product</Label>
            <Select defaultValue={state?.rawData?.product} name="product">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose the product you intersted in" />
              </SelectTrigger>
              <SelectContent>
                {productsData.map((product) => (
                  <SelectItem key={product.title} value={product.title}>
                    {product.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.product?.map((er) => {
              return (
                <ErrorMessage
                  key={er}
                  classNames="text-sm bg-transparent p-0 "
                  msg={er}
                />
              );
            })}
          </div>
          <div className="grid gap-3 ">
            <Label htmlFor="reason">Contact Reason</Label>
            <RadioGroup
              id="reason"
              name="reason"
              className="flex items-center gap-6 flex-wrap"
              defaultValue={state?.rawData?.reason}
            >
              <div className="flex gap-2">
                <RadioGroupItem id="question" value="question" />
                <Label htmlFor="question">Question</Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem id="complain" value="complain" />
                <Label htmlFor="complain">Complain</Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem id="bug" value="bug" />
                <Label htmlFor="bug">Bug</Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem id="other" value="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
            {state?.errors?.reason?.map((er) => {
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
            <Label htmlFor="message">Message</Label>
            <Textarea defaultValue={state?.rawData?.message} name="message" id="message" required />
            {state?.errors?.message?.map((er) => {
              return (
                <ErrorMessage
                  key={er}
                  classNames="text-sm bg-transparent p-0 "
                  msg={er}
                />
              );
            })}
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Loader /> : "Send"}
          </Button>
          {state?.success && (
            <SuccessMessage
              msg={"Thank you for your feedback. We will get back to you as soon as possible!"}
            />
          )}
          {state?.error && <ErrorMessage msg={state.error.message} />}
        </div>
      </form>
    </div>
  );
}
