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
import type { ContactDataType } from '@/email/mail';

export default function ContactEmail({ data }: { data: ContactDataType }) {
  return (
    <Html>
      <Preview>Contact Form Email </Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Contact Form email</Heading>
            <Section className="space-y-8">
              <Text>{data.fullName}</Text>
              <Text>{data.email}</Text>
              <Text>{data.product}</Text>
              <Text>{data.reason}</Text>
              <Text>{data.message}</Text>
              <Text>{`is bot: ${data.phone}`}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
