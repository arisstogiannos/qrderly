"use client"

import type React from "react"

import { useState } from "react"
import { CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { unsubscribe } from "./unsubscribe"
import Loader from "@/components/Loader"

export default function UnsubscribeForm({ email }: { email: string }) {
  const t = useTranslations("unsubscribe")
  const [submitted, setSubmitted] = useState(false)
  const [unsubscribeAll, setUnsubscribeAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState({
    marketing: false,
    updates: false,
    newsletter: false,
    announcements: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Here you would typically call a server action to update the user's preferences
    // For demo purposes, we're just setting the submitted state
    await unsubscribe(email)
    setLoading(false)
    setSubmitted(true)
  }

  const handleOptionChange = (option: keyof typeof selectedOptions) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }))
  }

  if (submitted) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl">{t("success.title")}</CardTitle>
            <CardDescription>{t("success.description")}</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            {unsubscribeAll ? (
              <p>{t("success.allUnsubscribed")}</p>
            ) : (
              <p>{t("success.specificUnsubscribed")}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center mt-6">
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              {t("success.updateButton")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md transition-all duration-300 bg-background">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <RadioGroup
              defaultValue="specific"
              className="space-y-4"
              onValueChange={(value) => setUnsubscribeAll(value === "all")}
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="all" id="all" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="all" className="font-medium">
                    {t("unsubscribeAll.title")}
                  </Label>
                  <p className="text-sm text-muted-foreground">{t("unsubscribeAll.description")}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="specific" id="specific" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="specific" className="font-medium">
                    {t("unsubscribeSpecific.title")}
                  </Label>
                  <p className="text-sm text-muted-foreground">{t("unsubscribeSpecific.description")}</p>
                </div>
              </div>
            </RadioGroup>

            {!unsubscribeAll && (
              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="marketing"
                    checked={selectedOptions.marketing}
                    onCheckedChange={() => handleOptionChange("marketing")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="marketing" className="font-medium">
                      {t("options.marketing.title")}
                    </Label>
                    <p className="text-sm text-muted-foreground">{t("options.marketing.description")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="updates"
                    checked={selectedOptions.updates}
                    onCheckedChange={() => handleOptionChange("updates")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="updates" className="font-medium">
                      {t("options.updates.title")}
                    </Label>
                    <p className="text-sm text-muted-foreground">{t("options.updates.description")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="newsletter"
                    checked={selectedOptions.newsletter}
                    onCheckedChange={() => handleOptionChange("newsletter")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="newsletter" className="font-medium">
                      {t("options.newsletter.title")}
                    </Label>
                    <p className="text-sm text-muted-foreground">{t("options.newsletter.description")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="announcements"
                    checked={selectedOptions.announcements}
                    onCheckedChange={() => handleOptionChange("announcements")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="announcements" className="font-medium">
                      {t("options.announcements.title")}
                    </Label>
                    <p className="text-sm text-muted-foreground">{t("options.announcements.description")}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full mt-6" disabled={loading}>
             {loading ? <Loader className="w-4 h-4 mr-2" /> : null} {t("saveButton")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
