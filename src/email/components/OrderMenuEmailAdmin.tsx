import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type { OrderMenuDataType } from '@/email/mail';

export default function OrderMenuEmailAdmin({ data }: { data: OrderMenuDataType }) {
  return (
    <Html>
      <Preview>Order Menu Form Email </Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Order Menu Form email</Heading>
            <Section className="space-y-8">
              <Text>{data.email}</Text>
              <Text>{data.product}</Text>
              <Text>{data.comment}</Text>
              <Text>{`is bot: ${data.phone}`}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
