import React from "react";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
// import { Instrument_Sans } from "next/font/google";

// const instrumentsSans = Instrument_Sans({
//   variable: "--font-instrument-sans",
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

function EmailVerification({ confirmLink }: { confirmLink: string }) {
  return (
    // <div></div>
    <Html>
      <Preview>Verification Email </Preview>
      <Tailwind>
        <Head />
        <Body className="antialiased" style={{ fontFamily: "'Instrument Sans', Arial, sans-serif" }}>
          <Container className="max-w-xl overflow-hidden ">
            <Section>
              <Row className="">
                <Column className="mr-0 p-0">
                  <Img
                    className=" w-fit mr-0"
                    src="https://scanby.vercel.app/logo black.png"
                  />
                </Column>
                <Column className="m-0">
                  <Text className="font-medium text-2xl">scanby</Text>
                </Column>
              </Row>
            </Section>
            <Section className="mt-4">
              <Heading  className="font-medium m-0">
                Confirm your email address
              </Heading>
              <Text className="text-lg">
                Click on the button below to confirm your address and activate
                your account.
              </Text>
            </Section>
            <Section>
              <Button
                className="bg-black rounded-md mt-4 text-white text-lg p-2 font-normal px-8 py-1"
                href={confirmLink}
              >
                Confirm
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default EmailVerification;
