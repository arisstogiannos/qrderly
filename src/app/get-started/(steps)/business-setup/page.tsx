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
import React from "react";
import BusinessSetupForm from "../../_components/BusinessSetupForm";

export default function page() {
  return (
    <section className="space-y-5 min-w-xl">
      <h1 className="text-2xl font-medium">Business Setup</h1>
      <BusinessSetupForm/>
    </section>
  );
}
