"use client";

import type React from "react";

import { useState } from "react";
import { z } from "zod";
import { Send, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { sendContactEmail, sendFeedbackEmailAdmin } from "@/email/mail";
import { useSession } from "next-auth/react";

const feedbackFormSchema = z.object({
  rating: z.string().min(1, { message: "validation.rating" }),
  feedbackType: z.string().optional(),
  comment: z
    .string()
    .min(10, { message: "validation.comment.min" })
    .max(500, { message: "validation.comment.max" }),
  email: z
    .string()
    .email({ message: "validation.email" })
    .optional()
    .or(z.literal("")),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

const StarRating = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const t = useTranslations("feedbackForm.rating.stars");

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          className="flex flex-col items-center"
          onMouseEnter={() => setHoveredRating(rating)}
          onMouseLeave={() => setHoveredRating(null)}
          onClick={() => onChange(rating.toString())}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onChange(rating.toString());
            }
          }}
          type="button"
        >
          <label
            htmlFor={`rating-${rating}`}
            className="cursor-pointer p-2 rounded-full hover:bg-muted"
          >
            <Star
              className={`h-8 w-8 ${
                hoveredRating !== null
                  ? hoveredRating >= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-none text-muted-foreground"
                  : Number.parseInt(value) >= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-none text-muted-foreground"
              }`}
            />
            <span className="sr-only">{t(rating.toString())}</span>
          </label>
          <input
            type="radio"
            id={`rating-${rating}`}
            name="rating"
            value={rating.toString()}
            className="sr-only"
          />
        </button>
      ))}
    </div>
  );
};

export default function FeedbackForm({
  isOnboarding = false,
}: {
  isOnboarding?: boolean;
}) {
  const t = useTranslations("feedbackForm");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession()
  const [formData, setFormData] = useState<FeedbackFormValues>({
    rating: "",
    feedbackType: "",
    comment: "",
    email: session.data?.user.email ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof FeedbackFormValues, value: string) => {
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
      feedbackFormSchema.parse(formData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Map form data to match expected structure
      const feedbackData = {
        rating: formData.rating,
        feedback: formData.feedbackType ?? "",
        message: formData.comment,
        email: formData.email,
      };

      await sendFeedbackEmailAdmin(null, feedbackData);

      toast.success(t("success.title"), {
        description: t("success.description"),
      });

      // Reset form
      setFormData({
        rating: "",
        feedbackType: "",
        comment: "",
        email: "",
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
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <div>
              <label htmlFor="rating" className="text-sm font-medium">
                {t("rating.label")}
              </label>
              <StarRating
                value={formData.rating}
                onChange={(value) => handleChange("rating", value)}
              />
              {errors.rating && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {errors.rating}
                </p>
              )}
            </div>
          </div>

          {!isOnboarding && (
            <div className="space-y-2">
              <label htmlFor="feedbackType" className="text-sm font-medium">
                {t("type.label")}
              </label>
              <Select
                value={formData.feedbackType}
                onValueChange={(value) => handleChange("feedbackType", value)}
              >
                <SelectTrigger id="feedbackType">
                  <SelectValue placeholder={t("type.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">{t("type.options.bug")}</SelectItem>
                  <SelectItem value="feature">
                    {t("type.options.feature")}
                  </SelectItem>
                  <SelectItem value="improvement">
                    {t("type.options.improvement")}
                  </SelectItem>
                  <SelectItem value="praise">
                    {t("type.options.praise")}
                  </SelectItem>
                  <SelectItem value="other">
                    {t("type.options.other")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.feedbackType && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {errors.feedbackType}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              {t("comment.label")}
            </label>
            <Textarea
              id="comment"
              placeholder={t("comment.placeholder")}
              className="resize-none min-h-[120px]"
              value={formData.comment}
              onChange={(e) => handleChange("comment", e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {t("comment.charCount", { count: formData.comment.length })}
            </p>
            {errors.comment && (
              <p className="text-sm font-medium text-destructive">
                {errors.comment}
              </p>
            )}
          </div>

          {!isOnboarding && (
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t("email.label")}
              </label>
              <Input
                id="email"
                placeholder={t("email.placeholder")}
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                {t("email.description")}
              </p>
              {errors.email && (
                <p className="text-sm font-medium text-destructive">
                  {errors.email}
                </p>
              )}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>{t("submitting")}</>
          ) : (
            <>
              {t("submit")}
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
