"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useFiltersContext } from "@/context/FiltersProvider";
import { useBusinessContext } from "@/context/BusinessProvider";
import { getCategories, getCategoriesWithItemCount } from "../../../_actions/categories";

export default function Categories() {
  const { setCategory } = useFiltersContext();
  const { businessName } = useBusinessContext();

  const {
    data: categories,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["categories"+businessName],
    queryFn: async () => {
      const categories = await getCategories(businessName);
      return categories;
    },
    staleTime:Infinity
  });

  if(isLoading) return <div className="bg-accent rounded-xl animate-pulse w-40 h-10"></div>


  // if (!categories || categories.length === 0) return null
    return (
      <Select  onValueChange={(v)=> setCategory(v)} defaultValue="all">
        <SelectTrigger className="min-w-40 max-md:w-full">
          <SelectValue placeholder="All Categories"  />
        </SelectTrigger>
        <SelectContent>
          {!categories || categories.length === 0 ? (
            <SelectItem value={"all"} className="pointer-events-none">No categories found</SelectItem>
          ) : (
            <>
            <SelectItem key={"all"} value={"all"}>All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.name} value={category.id}>{category.name}</SelectItem>
            ))}
            </>
          )}
        </SelectContent>
      </Select>
    );
}
