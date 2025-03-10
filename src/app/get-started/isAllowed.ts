import { auth } from "@/auth";
import { db } from "@/db";
import { redirect } from "next/navigation";

export default async function isAllowed() {
    const session = await auth();
    const user = await db.user.findUnique({
      where: { id: session?.user.id },
      include: {
        business: {
          select: { subscriptions: true, menu: true },
        },
      },
    });
  
    if (!user) {
      redirect("/unauthorized?msg=You need to login to access this page.") 
    }
  
    let isAllowed = false;
    let businessIndex = -1;
  
    let subIndex;
    user.business.forEach((b, bIndex) => {
      b.subscriptions.forEach((s, prIndex) => {
        if (s && !b.menu) {
          businessIndex = bIndex;
          subIndex = prIndex;
          isAllowed = true;
        }
      });
    });
  
    if (!isAllowed) {
      redirect("/unauthorized?msg=You have no subscription with unset businesses.") 
    }
    
    return null
  }
  