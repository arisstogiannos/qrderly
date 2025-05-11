"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { z } from "zod";
import { Send, Star, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { uploadMultipleImagesClientSide } from "@/lib/uploadImageClient";
import { sendOrderMenuEmail, sendOrderMenuEmailAdmin } from "@/email/mail";
import { ImageUploader } from "./ImageUploader";
import { useSession } from "next-auth/react";

const orderMenuSchema = z.object({
  product: z.string().min(1, { message: "validation.product" }),
  comment: z
    .string()
    .max(500, { message: "validation.comment.max" }),
  email: z.string().email({ message: "validation.email" }),
  images: z.array(z.instanceof(File)).min(1, { message: "images.min" }),
  phone: z.string().optional(),
  businessName: z.string().optional(),
});

type OrderMenuValues = z.infer<typeof orderMenuSchema>;

export default function OrderMenuForm({onSubmit}: {onSubmit: () => void}) {
  const t = useTranslations("orderMenu");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSession().data?.user;
  const [formData, setFormData] = useState<OrderMenuValues>({
    product: "",
    comment: "",
    email: user?.email || "",
    images: [],
    phone: "",
    businessName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (field: keyof OrderMenuValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user makes changes
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    try {
      orderMenuSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        for (const err of error.errors) {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = t(err.message);
          }
        }
        setErrors(newErrors);
      }
      return false;
    }
  };

 

  const handleImagesChange = (newImages: File[]) => {
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (formData.images?.length) {
        await uploadMultipleImagesClientSide(
          formData.images,
          `menu-orders/${formData.email}`
        );
      }
      const formDataToSend = new FormData();
      formDataToSend.append("product", formData.product);
      formDataToSend.append("comment", formData.comment);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("businessName", formData.businessName || "");
      await sendOrderMenuEmail(formData.email, formData.email, formData.comment, formData.phone || "", user?.name || null, formData.email);
      await sendOrderMenuEmailAdmin(null, formDataToSend);

      toast.success(t("success.title"), {
        description: t("success.description"),
      });
      onSubmit();
      document.cookie = "menu-order-submitted=true; path=/";

      setFormData({
        product: "",
        comment: "",
        email: "",
        images: [],
        phone: "",
      });
    } catch (error) {
      toast.error(t("error.title"), {
        description: t("error.description"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
    {/* Left side - Text content */}
    <div className="space-y-6 text-center lg:text-left 2xl:pr-20">
      <h2 className="2xl:text-6xl text-4xl font-bold ">
        {t("title")}
      </h2>
      <p className="2xl:text-2xl text-lg text-foreground/90">
        {t("description")}
      </p>
    </div>

    {/* Right side - Form */}
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="product" className="text-sm font-medium">
            {t("product.label")}
          </Label>
          <Select
            value={formData.product}
            onValueChange={(value) => handleChange("product", value)}
            required
          >
            <SelectTrigger
              id="product"
              className="h-12 bg-accent/30 border-none data-[placeholder]:text-foreground/80 [&_svg:not([class*='text-'])]:text-foreground/80"
            >
              <SelectValue placeholder={t("product.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="qrMenu">
                {t("product.qrMenu")}
              </SelectItem>
              <SelectItem value="orderingQrMenu">
                {t("product.orderingQrMenu")}
              </SelectItem>
              <SelectItem value="selfServiceMenu">
                {t("product.selfServiceMenu")}
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.product && (
            <p className="text-sm font-medium text-red-900 mt-1">
              {errors.product}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessName" className="text-sm font-medium">
            {t("businessName.label")}
          </Label>
          <Input
            id="businessName"
            placeholder={t("businessName.placeholder")}
            className="h-12 text-base bg-accent/30 border-none placeholder:text-foreground/50"
            value={formData.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
          />
        </div>

     

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            {t("email.label")}
          </Label>
          <Input
            id="email"
            placeholder={t("email.placeholder")}
            type="email"
            className="h-12 text-base bg-accent/30 border-none placeholder:text-foreground/50"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
          <p className="text-sm text-for">{t("email.description")}</p>
          {errors.email && (
            <p className="text-sm font-medium text-red-900">
              {errors.email}
            </p>
          )}
        </div>

        <ImageUploader
          images={formData.images || []}
          onImagesChange={handleImagesChange}
          t={t}
        />
        {errors.images && (
          <p className="text-sm font-medium text-red-900">
            {errors.images}
          </p>
        )}

<div className="space-y-2">
          <Label htmlFor="comment" className="text-sm font-medium">
            {t("comment.label")}
          </Label>
          <Textarea
            id="comment"
            placeholder={t("comment.placeholder")}
            className="resize-none min-h-[150px] text-base bg-accent/30 border-none placeholder:text-foreground/50"
            value={formData.comment}
            onChange={(e) => handleChange("comment", e.target.value)}
            required
            maxLength={500}
          />
          <p className="text-sm text-for">
            {t("comment.charCount", { count: formData.comment.length })}
          </p>
          {errors.comment && (
            <p className="text-sm font-medium text-red-900">
              {errors.comment}
            </p>
          )}
        </div>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          className="h-0 w-0"
        />
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-12 text-base font-medium bg-foreground"
        >
          {isSubmitting ? (
            <>{t("submitting")}</>
          ) : (
            <>
              {t("submit")}
              <Send className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </form>
    </div>
  </div>
  );
}
