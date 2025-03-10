import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const libsql = createClient({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
})

const adapter = new PrismaLibSQL(libsql)
export const db = new PrismaClient({ adapter })










// import { auth as middleware } from "@/auth"

// const protectedRoutes =[
//   "/create-menu"
// ]

// export default middleware((req)=>{
//   const isLoggedin = !!req.auth
//     console.log("hello:"+req.nextUrl.pathname)
// })


// export const config = {
//     matcher: [
//       // Skip Next.js internals and all static files, unless found in search params
//       '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//       // Always run for API routes
//       '/(api|trpc)(.*)',
//     ],
//   }