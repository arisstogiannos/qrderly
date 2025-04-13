"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {  Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";


export default function DeleteModal<T>({
  item,
  action,
}: {
  item: T;
  action: (item: T) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("admin.delete");
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"destructive"}
          size={"sm"}
          className="w-full text-sm px-0 py-4 "
        >
         <Trash2/> {t("delete")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xs sm:max-w-sm h-auto p-4">
        <DialogHeader className="">
          <DialogTitle className="textb">{t("title")}</DialogTitle>
          <DialogDescription>
           {(t("desc"))}
          </DialogDescription>
        </DialogHeader>
          <Button
            variant={"destructive"}
            size={"sm"}
            className="w-full text-sm px-0 py-4 mt-3"
            onClick={action.bind(null, item)}
          >
            {t("delete")}
          </Button>
      </DialogContent>
    </Dialog>
  );
}
