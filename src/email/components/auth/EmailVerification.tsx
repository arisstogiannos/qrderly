import { Body, Button, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from "@react-email/components"
import { Copyright } from "lucide-react"

interface VerificationEmailProps {
  username: string
  verificationUrl: string
}

export const VerificationEmail = ({
  username = "user ",
  verificationUrl,
}: VerificationEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://scanby.cloud"

  return (
    <Html>
      <Head />
      <Preview>Verify your email address for Scanby</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={`${baseUrl}/logo black.png`} width="60" height="40" alt="Scanby" style={logo} />
          <Heading style={h1}>Verify your email address</Heading>
          <Text style={text}>Hi {username},</Text>
          <Text style={text}>
            Please verify your email address to complete your Scanby account setup. This helps us confirm
            you're a real person and secures your account.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={verificationUrl}>
              Verify Email Address
            </Button>
          </Section>
          <Text style={text}>
            If you didn't create an account with Scanby, you can safely ignore this email.
          </Text>
          <Text style={text}>This verification link will expire in 24 hours.</Text>
          <Hr style={hr} />
          <Text style={footer}>
          <Copyright/> Scanby 20025

          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default VerificationEmail

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "40px 0",
}

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(20, 50, 70, 0.2)",
  margin: "0 auto",
  maxWidth: "600px",
  padding: "20px",
}

const logo = {
  margin: "0 auto 20px",
  display: "block",
}

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
}

const text = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
}

const button = {
  backgroundColor: "#5046e4",
  borderRadius: "4px",
  color: "#fff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  padding:"10px"
}

const hr = {
  borderColor: "#e5e7eb",
  margin: "30px 0",
}

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "22px",
  margin: "12px 0",
  textAlign: "center" as const,
  display:"flex",
alignItems:"center",
justifyItems:"center",
width:"100%",
gap:"10px"
}
