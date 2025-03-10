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
import { productsData } from "@/data";
import React from "react";

export default function ContactForm() {
  return (
    <div className="max-w-xl bg-background p-6 rounded-3xl outline-2 outline-primary/10">
      <form>
        <div className="flex flex-col gap-6">
          <div className="grid gap-3">
            <Label htmlFor="fullname">Full Name</Label>
            <Input id="fullname" type="fullname" required />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="product">Product</Label>
            <Select name="product">
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
          </div>

          <div className="grid gap-3">
            <Label htmlFor="message">Message</Label>
            <Input id="message" type="text" required />
          </div>
          <Button type="submit" className="w-full">
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
