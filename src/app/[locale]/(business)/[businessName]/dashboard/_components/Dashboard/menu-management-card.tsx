
import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export async function MenuManagementCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Menu Management</CardTitle>
          <CardDescription>Manage your digital menu items</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 rounded-lg border p-3">
              <div className="h-16 w-16 rounded-md overflow-hidden">
                <Image
                  src="/image-placeholder.png?height=64&width=64"
                  alt="Menu Item"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">Margherita Pizza</h4>
                    <p className="text-sm text-muted-foreground">Fresh tomatoes, mozzarella, basil</p>
                  </div>
                  <div className="font-medium">$12.99</div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                    Popular
                  </span>
                  <span className="text-xs text-muted-foreground">Orders: 145</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border p-3">
              <div className="h-16 w-16 rounded-md overflow-hidden">
                <Image
                  src="/placeholder.svg?height=64&width=64"
                  alt="Menu Item"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">Pasta Carbonara</h4>
                    <p className="text-sm text-muted-foreground">Eggs, cheese, pancetta, black pepper</p>
                  </div>
                  <div className="font-medium">$14.99</div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                    Bestseller
                  </span>
                  <span className="text-xs text-muted-foreground">Orders: 120</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border p-3">
              <div className="h-16 w-16 rounded-md overflow-hidden">
                <Image
                  src="/placeholder.svg?height=64&width=64"
                  alt="Menu Item"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">Tiramisu</h4>
                    <p className="text-sm text-muted-foreground">Coffee-soaked ladyfingers, mascarpone</p>
                  </div>
                  <div className="font-medium">$8.99</div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Orders: 78</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border p-3">
              <div className="h-16 w-16 rounded-md overflow-hidden">
                <Image
                  src="/placeholder.svg?height=64&width=64"
                  alt="Menu Item"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">House Wine</h4>
                    <p className="text-sm text-muted-foreground">Red or white, glass</p>
                  </div>
                  <div className="font-medium">$7.99</div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Orders: 92</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Menu Items
        </Button>
      </CardFooter>
    </Card>
  )
}
