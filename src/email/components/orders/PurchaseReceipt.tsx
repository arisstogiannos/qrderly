import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import OrderInformation from "./OrderInformation";

type thisProps = {
  order: { id: string; createdAt: Date; pricePaidInCents: number };
};



export default function PurchaseReceiptEmail({ order }: thisProps) {
  return (
    <Html>
      <Preview>Download </Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation order={order}  />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
