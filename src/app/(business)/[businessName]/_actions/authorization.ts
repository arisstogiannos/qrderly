"use server"

import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export async function checkUserAuthorized(businessName:string){

      const session = await auth();
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