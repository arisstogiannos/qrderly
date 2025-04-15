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

import React, { useActionState } from "react";
import { submitBusinessInfo } from "../../actions";
import { ErrorMessage } from "@/components/Messages";
import { ProductURL } from "@/types";
import Loader from "@/components/Loader";
import TablesSetup from "./TablesSetup";
import { supportedCurrencies } from "@/lib/formatter";
import { useTranslations } from "next-intl";

export default function BusinessSetupForm({
  product,
}: {
  product: ProductURL;
}) {
  const [state, action, isPending] = useActionState(
    submitBusinessInfo.bind(null, product),
    null
  );
  const t = useTranslations("businessSetupForm");

  return (
    <form action={action} className="flex flex-col gap-6 max-w-3xl">
      <div className="grid gap-3">
        <div className="space-y-1">
          <Label htmlFor="name">{t("businessName")}</Label>
          <p className="text-sm text-muted-foreground">{t("businessNameHint")}</p>
        </div>
        <Input
          pattern="[A-Za-z0-9\-._~ ]*"
          title={t("businessNameValidation")}
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
        <Label htmlFor="type">{t("businessType")}</Label>
        <Select name="type" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("businessTypePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"restaurant"}>{t("restaurant")}</SelectItem>
            <SelectItem value={"bar"}>{t("bar")}</SelectItem>
            <SelectItem value={"cafeteria"}>{t("cafeteria")}</SelectItem>
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
        <Label htmlFor="currency">{t("currency")}</Label>
        <Select name="currency" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("currencyPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {supportedCurrencies.map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
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
        <Label htmlFor="country">{t("country")}</Label>
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
        <Label htmlFor="city">{t("city")}</Label>
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
        className="bg-foreground  w-full sm:w-fit sm:ml-auto text-lg rounded-lg h-10 sm:h-9 sm:rounded-full  min-w-24"
      >
        {isPending ? (
          <Loader className="text-xs" />
        ) : (
          <>
            {t("next")} <ArrowRight className="size-5" />
          </>
        )}
      </Button>
      {state?.error && <ErrorMessage msg={state.error} />}
    </form>
  );
}
