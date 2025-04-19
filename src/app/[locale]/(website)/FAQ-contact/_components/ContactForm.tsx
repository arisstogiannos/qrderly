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
import { useTranslations } from "next-intl";
import React, { useActionState } from "react";

export default function ContactForm() {
  const [state, action, isPending] = useActionState(sendContactEmail, null);
  const t = useTranslations("faq.contact-fields");
  return (
    <div className="max-w-xl lg:min-w-xl bg-background p-6 rounded-3xl outline-2 outline-primary/10">
      <form action={action}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="fullname">{t("name")}</Label>
            <Input
              id="fullname"
              name="fullName"
              defaultValue={state?.rawData?.fullName}
              type="fullname"
              required
            />
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
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              defaultValue={state?.rawData?.email}
              type="email"
              required
            />
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
            <Label htmlFor="product">{t("product")}</Label>
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
            <Label htmlFor="reason">{t("contact reason")}</Label>
            <RadioGroup
              id="reason"
              name="reason"
              className="flex items-center gap-6 flex-wrap"
              defaultValue={state?.rawData?.reason}
            >
              <div className="flex gap-2">
                <RadioGroupItem id="question" value="question" />
                <Label htmlFor="question">
                  {t("contact reason options.1")}
                </Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem id="complain" value="complain" />
                <Label htmlFor="complain">
                  {t("contact reason options.2")}
                </Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem id="bug" value="bug" />
                <Label htmlFor="bug">{t("contact reason options.3")}</Label>
              </div>
              <div className="flex gap-2">
                <RadioGroupItem id="other" value="other" />
                <Label htmlFor="other">{t("contact reason options.4")}</Label>
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
            <Label htmlFor="message">{t("message")}</Label>
            <Textarea
              defaultValue={state?.rawData?.message}
              name="message"
              id="message"
              required
            />
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
            {isPending ? <Loader /> : t("send")}
          </Button>
          {state?.success && (
            <SuccessMessage
              msg={
                "Thank you for your feedback. We will get back to you as soon as possible!"
              }
            />
          )}
          {state?.error && <ErrorMessage msg={state.error} />}
        </div>
        <input
          type="text"
          name="phone"
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
        />
      </form>
    </div>
  );
}
