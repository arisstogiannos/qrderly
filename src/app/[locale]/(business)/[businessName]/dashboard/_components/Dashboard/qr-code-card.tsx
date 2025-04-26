"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BusinessExtended } from "@/types"
import QrDisplay from "./QrDisplay"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export function QrCodeCard({ business }: { business: BusinessExtended }) {
  const t  = useTranslations('dashboard');

  return (
    <Card>
      <CardHeader className="justify-between flex-row items-start">
        <div className="space-y-0.5">
          <CardTitle>{t('qrCode')}</CardTitle>
          <CardDescription>{t('qrCodeDescription')}</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={{params:{businessName:business.name},pathname:"/[businessName]/dashboard/qr"}}>
          {t('customize')}
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div
          className={cn(
            "grid sm:grid-cols-2 grid-cols-1 gap-y-5",
            !business.tables && " sm:grid-cols-1"
          )}
        >
          <QrDisplay business={business} />
          {business.tables && (
            <div className="w-full pl-5 space-y-3">
              <p>{t('tables')}</p>
              <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[250]">
                {business.tables.split(",").map((t) => (
                  <div
                    className="px-2 py-1 size-fit bg-accent border-primary/20 border rounded-md"
                    key={t}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


