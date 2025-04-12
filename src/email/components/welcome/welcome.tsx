import React from "react";
import {
    Body,
    Button,
    Container,
    Font,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
  } from "@react-email/components";

function Welcome({confirmLink}: {confirmLink: string}) {
  return (
    // <div></div>
    <Html>
      <Preview>Verification Email </Preview>
      <Tailwind >
        <Head />

        <Body className="font-sans bg-white">
          <Container  className="max-w-xl overflow-hidden font-[family-name:var(--font-instrument-sans)]">
          <Img className="w-full" src="http://localhost:3001/Banner.png" alt="sss"/>
          <Section className="mx-2">

            <Heading className="font-medium ">Welcome to scanby! Let’s Get You Set Up</Heading>
            <Container className="text-xl ml-0 flex md:text-3xl">

            <Text className="m-0 leading-0 text-lg ">Hey [First Name],</Text>
            <Text style={{lineHeight:1}} className="text-lg">Welcome to scanby – the easiest way to offer seamless, contactless ordering at your business! </Text>
            </Container>
            <Section className="flex leading-0">

            <Text>Here’s what you can do next:</Text>
            <Text style={{lineHeight:0.8}} className="m-0 p-0">✅ Set up your digital menu in minutes</Text>
            <Text style={{lineHeight:0.8}}>✅ Generate & print your custom QR codes</Text>
            <Text style={{lineHeight:0.8}}>✅ Start accepting contactless orders effortlessly</Text>
            </Section>
            <Section className="mt-5">
            <Button className="bg-blue-900 rounded-full text-white text-lg py-2 px-4" href={confirmLink}>Dive In</Button>
            </Section>
          </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default Welcome