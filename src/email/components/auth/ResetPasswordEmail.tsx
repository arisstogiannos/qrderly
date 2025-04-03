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

function ResetPasswordEmail({resetLink}: {resetLink: string}) {
  return (
    // <div></div>
    <Html>
    <Preview>Change your password </Preview>
    <Tailwind>
      <Head />
      <Body className="antialiased" style={{ fontFamily: "'Instrument Sans', Arial, sans-serif" }}>
        <Container className="max-w-xl overflow-hidden ">
          <Section>
            <Row className="">
              <Column className="mr-0 p-0">
                <Img
                  className=" w-fit mr-0"
                  src="https://qrderly.vercel.app/logo black.png"
                />
              </Column>
              <Column className="m-0">
                <Text className="font-medium text-2xl">Orderly</Text>
              </Column>
            </Row>
          </Section>
          <Section className="mt-4">
            <Heading  className="font-medium m-0">
              Reset your Password
            </Heading>
            <Text className="text-base mb-1">
              Hi name
            </Text>
            <Text className="text-base mt-0">
            Someone recently requested a password change for your Orderly account. If this was you, you can set a new password here:
            </Text>
          </Section>
          <Section>
            <Button
              className="bg-black rounded-md mt-4 text-white text-lg p-2 font-normal px-8 py-1"
              href={resetLink}
            >
              Reset Password
            </Button>
          </Section>
            <Text className="text-base mt-10">
            If you don't want to change your password or didn't request this, just ignore and delete this message.
            </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
  )
}

export default ResetPasswordEmail