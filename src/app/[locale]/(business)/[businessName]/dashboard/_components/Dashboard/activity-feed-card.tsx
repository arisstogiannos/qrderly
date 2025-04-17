"use client"

import { FileText, QrCode, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivityFeedCardProps {
  isOrderingMenu: boolean
}

export function ActivityFeedCard({ isOrderingMenu }: ActivityFeedCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Menu Updated</p>
              <p className="text-xs text-muted-foreground">You added 3 new items to your menu</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <QrCode className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">QR Code Downloaded</p>
              <p className="text-xs text-muted-foreground">You downloaded your QR code</p>
              <p className="text-xs text-muted-foreground">Yesterday</p>
            </div>
          </div>
          {isOrderingMenu && (
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">New Customer</p>
                <p className="text-xs text-muted-foreground">You received an order from a new customer</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
