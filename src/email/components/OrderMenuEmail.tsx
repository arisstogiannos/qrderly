import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import { getTranslations } from 'next-intl/server';
import type { OrderMenuDataType } from '../mail';

export const OrderMenuEmail = async ({
  product,
  email,
  comment,
  businessName,
  username,
}: OrderMenuDataType & { username: string | null }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.scanby.cloud';
  const t = await getTranslations('emails.orderMenu');

  return (
    <Html>
      <Head />
      <Preview>{t('subject')}</Preview>
      <Body style={main}>
        <Container>
          <Heading>{t('heading')}</Heading>
          <Text>{t('greeting', { username })}</Text>
          <Text>{t('message')}</Text>
          <Button style={button} href={`${baseUrl}/sign-up`}>
            {t('button')}
          </Button>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: '40px 0',
};

const unsubscribeContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const unsubscribeText = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const unsubscribeButton = {
  color: '#4b5563',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #eee',
  borderRadius: '5px',
  boxShadow: '0 5px 10px rgba(20, 50, 70, 0.2)',
  margin: '0 auto',
  maxWidth: '600px',
  padding: '20px',
};

const logo = {
  margin: '0 auto 20px',
  display: 'block',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#5046e4',
  borderRadius: '4px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '10px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
};

const footer = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '22px',
  margin: '12px 0',
  textAlign: 'center' as const,
  display: 'flex',
  alignItems: 'center',
  justifyItems: 'center',
  width: '100%',
  gap: '10px',
};

const list = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 0 0 20px',
};

const listItem = {
  margin: '8px 0',
};
