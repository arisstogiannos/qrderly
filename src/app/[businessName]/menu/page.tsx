import { db } from '@/db'
import { notFound } from 'next/navigation'
import React from 'react'

   
  // Next.js will invalidate the cache when a
  // request comes in, at most once every 60 seconds.
  export const revalidate = 60
   
  // We'll prerender only the params from `generateStaticParams` at build time.
  // If a request comes in for a path that hasn't been generated,
  // Next.js will server-render the page on-demand.
  export const dynamicParams = true // or false, to 404 on unknown paths
   
  export async function generateStaticParams() {
    const menus = await db.menu.findMany({include:{business:{select:{name:true}}}})
    return menus.map((menu) => ({
        businessName: String(menu.business.name),
    }))
  }

export default async function page({params}:{params:Promise<{businessName:string}>}) {
    const businessname = (await params).businessName
    const menu = await db.menu.findFirst({where:{business:{name:businessname}}})

    if(!menu){
        notFound()
    }
    
  return (
    <div>{menu?.theme}</div>
  )
}


