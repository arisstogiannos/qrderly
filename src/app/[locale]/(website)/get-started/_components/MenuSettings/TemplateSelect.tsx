
import { Label } from "@/components/ui/label";

import React from "react";
import { ErrorMessage } from "@/components/Messages";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu, Template } from "@prisma/client";

export default function TemplateSelect({template,menu,errors}:{template:Template,menu?:Menu,errors?:string[] | undefined}) {
  return (
    <div className="grid gap-3">
    <Label>Template</Label>
    <Select
      required
      name="template"
      defaultValue={ menu?.template ??template ?? "T1"}
      onValueChange={(v) => history.pushState(null, "", "?t=" + v)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select template" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="T1">Template 1</SelectItem>
        <SelectItem value="T2">Template 2</SelectItem>
      </SelectContent>
    </Select>

    {errors?.map((er) => {
      return (
        <ErrorMessage
          key={er}
          classNames="text-sm bg-transparent p-0 "
          msg={er}
        />
      );
    })}
  </div>
  )
}
