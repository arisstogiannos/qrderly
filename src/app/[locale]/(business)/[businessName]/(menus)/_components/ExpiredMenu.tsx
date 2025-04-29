import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search } from "lucide-react"

export default function ExpiredMenu() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 text-center">
    <div className="mx-auto  flex flex-col">
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-purple-500 opacity-75 blur-xl"></div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl">
            <Search className="h-10 w-10 text-slate-400" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <h1 className="mb-8 2xl:text-nowrap bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-6xl md:text-8xl font-extrabold text-transparent">
      Menu Not Found
      </h1>


      <p className="mb-2 text-slate-800 max-w-md mx-auto">
        Sorry, we couldn't find the menu you're looking for. It might have been moved, deleted, or never existed.
      </p>
      <p className="mb-8 text-slate-800 max-w-md mx-auto">
       If you are the owner of this menu, check your dashboard to resolve the issue.
      </p>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 mx-auto">
        <Button
          asChild
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <Button asChild variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
          <Link href="/FAQ-contact">Contact Support</Link>
        </Button>
      </div>
    </div>

    <div className="mt-16 text-sm text-slate-500">
      <p>© {new Date().getFullYear()} Scanby. All rights reserved.</p>
    </div>
  </div>
  )
}
