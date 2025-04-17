"use client"

import Image from "next/image"
import { Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BusinessExtended } from "@/types"
import { useTranslations } from 'next-intl';

export function BusinessInfoCard({business}:{business:BusinessExtended}) {
  const t = useTranslations('dashboard');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('businessInfo')}</CardTitle>
        {/* <CardDescription>{t('manageDetails')}</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{business.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <Store className="h-3.5 w-3.5 mr-1" />
              {business.location}
            </p>
            <p className="text-sm text-muted-foreground">{business.type}</p>
          </div>
        </div>
      </CardContent>
      {/* <CardFooter>
        <Button variant="outline" size="sm">
          {t('edit')}
        </Button>
      </CardFooter> */}
    </Card>
  );
}
