import React from 'react'
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
  } from "@react-email/components";
import type {  FeedbackDataType } from '@/email/mail';

export default function FeedbackEmailAdmin({data}: {data: FeedbackDataType}) {
  return (
    <Html>
      <Preview>Feedback Form Email </Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Feedback Form email</Heading>
            <Section className='space-y-8'>
                <Text>{data.email}</Text>
                <Text>{data.feedback}</Text>
                <Text>{data.message}</Text>
                <Text>{`rating: ${data.rating}`}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}