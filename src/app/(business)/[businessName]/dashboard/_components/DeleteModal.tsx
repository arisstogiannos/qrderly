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


export default function DeleteModal<T>({
  item,
  action,
}: {
  item: T;
  action: (item: T) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"destructive"}
          size={"sm"}
          className="w-full text-sm px-0"
        >
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xs sm:max-w-sm h-auto">
        <DialogHeader className="">
          <DialogTitle className="textb">Delete Item</DialogTitle>
          <DialogDescription>
            Are You sure you want to delete this item?
          </DialogDescription>
        </DialogHeader>
          <Button
            variant={"destructive"}
            size={"sm"}
            className="w-full text-sm px-0 py-4"
            onClick={action.bind(null, item)}
          >
            Delete
          </Button>
      </DialogContent>
    </Dialog>
  );
}
