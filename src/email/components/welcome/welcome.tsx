import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Copyright } from "lucide-react";

interface WelcomeEmailProps {
  username: string;
  userEmail: string;
}

export const WelcomeEmail = ({
  username = "John",
  userEmail = "john@example.com",
}: WelcomeEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://scanby.cloud";

  return (
    <Html>
      <Head />
      <Preview>Welcome to Scanby - Let's get started!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/logo black.png`}
            width="60"
            height="40"
            alt="Scanby"
            style={logo}
          />
          <Heading style={h1}>Welcome to Scanby!</Heading>
          <Text style={text}>Hi {username},</Text>
          <Text style={text}>
            Thank you for signing up for Scanby. We're excited to help
            you create beautiful, digital menus for your restaurant or business.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={`${baseUrl}/get-started`}>
              Get Started
            </Button>
          </Section>
          <Text style={text}>With Scanby, you can:</Text>
          <ul style={list}>
            <li style={listItem}>Create unlimited digital menus</li>
            <li style={listItem}>Generate QR codes for easy customer access</li>
            <li style={listItem}>Update your menu in real-time</li>
            <li style={listItem}>Track menu views and customer engagement</li>
          </ul>
          <Text style={text}>
            If you have any questions, simply reply to this email. We're here to
            help!
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            <Copyright /> Scanby 20025
          </Text>
          <Text style={footer}>This email was sent to {userEmail}</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(20, 50, 70, 0.2)",
  margin: "0 auto",
  maxWidth: "600px",
  padding: "20px",
};

const logo = {
  margin: "0 auto 20px",
  display: "block",
};

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#5046e4",
  borderRadius: "4px",
  color: "#fff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "10px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "30px 0",
};

const footer = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "22px",
  margin: "12px 0",
  textAlign: "center" as const,
  display: "flex",
  alignItems: "center",
  justifyItems: "center",
  width: "100%",
  gap: "10px",
};

const list = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
  padding: "0 0 0 20px",
};

const listItem = {
  margin: "8px 0",
};
