"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { useBusinessContext } from "@/context/BusinessProvider";
import { CategoryWithItemCount } from "@/types";

export default function Categories({
  currCategory,
  categories
}: {
  currCategory?: string;
  categories:CategoryWithItemCount[]
}) {
  const { businessName } = useBusinessContext();


  

  return (
    <Select required defaultValue={currCategory} name="categoryId">
      <SelectTrigger className="w-full">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        {!categories || categories.length === 0 ? (
          <SelectItem value={"all"} className="pointer-events-none">
            No categories found
          </SelectItem>
        ) : (
          categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
