"use server"

import getSession from "@/lib/getSession";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";


// export  const checkUserAuthorizedCached = cache(checkUserAuthorized, ["auth-session"], { revalidate:600*90,tags:["auth-session"] }); // 60 sec cache

export async function checkUserAuthorized(businessName:string){

      const session = await getSession();
      const userRole = session?.user.role;
      const businesses = session?.user.business;
      
    
    
      if (userRole !== UserRole.ADMIN ) {
        redirect("/unauthorized");
      }
    
      if(!businesses){
        redirect("/unauthorized");
      }

      for (const b of businesses) {
        if(b.name === businessName){
            return {user:session.user,business:b};
        }
      }

      redirect("/unauthorized");

    
      
}