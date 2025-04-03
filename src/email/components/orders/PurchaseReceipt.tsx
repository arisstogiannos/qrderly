
import OrderInformation from "./OrderInformation";
import { ProductURL } from "@/types";
import { Subscription } from "@prisma/client";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
}   from "@react-email/components";




export default function PurchaseReceiptEmail({ sub }: {sub:Subscription}) {
  return (
    
    <Html>
      <Preview>Download </Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation sub={sub}  />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
