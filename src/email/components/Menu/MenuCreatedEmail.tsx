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

interface QrMenuCreatedEmailProps {
  username: string;
  menuName: string;
  menuUrlPath:string
}

export const QrMenuCreatedEmail = ({
  username = "John",
  menuName = "Summer Specials",
  menuUrlPath ="menu"
}: QrMenuCreatedEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://scanby.cloud";
  const menuUrl = baseUrl+"/" + menuName.replaceAll(" ","-") +"/menu"
  const dashboardUrl = baseUrl+"/" + menuName.replaceAll(" ","-")+"/dashboard"

  return (
    <Html>
      <Head />
      <Preview>Your QR Menu "{menuName}" is ready!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/logo black.png`}
            width="60"
            height="40"
            alt="QR Menu Creator"
            style={logo}
          />
          <Heading style={h1}>Your QR Menu is Ready!</Heading>
          <Text style={text}>Hi {username},</Text>
          <Text style={text}>
            Great news! Your QR menu "{menuName}" has been successfully created
            and is now live.
          </Text>
          {/* <Section style={qrCodeContainer}>
            <Img
              src={qrCodeUrl}
              width="200"
              height="200"
              alt="QR Code"
              style={qrCode}
            />
          </Section> */}
          <Text style={text}>
            Your customers can now scan your QR code to view your digital menu.
            You can print or download your QR code from your dashboard.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={menuUrl}>
              View Your Menu
            </Button>
          </Section>
          <Text style={text}>
            Remember, you can update your menu anytime from your dashboard, and
            the changes will be reflected instantly for your customers.
          </Text>
          <Section style={buttonContainer}>
            <Button style={secondaryButton} href={dashboardUrl}>
              Go to Dashboard
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            <Copyright /> Scanby 20025
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default QrMenuCreatedEmail;

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

const qrCodeContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const qrCode = {
  border: "1px solid #e5e7eb",
  padding: "10px",
  backgroundColor: "#ffffff",
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

const secondaryButton = {
  backgroundColor: "#ffffff",
  borderRadius: "4px",
  border: "1px solid #5046e4",
  color: "#5046e4",
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
  display:"flex",
alignItems:"center",
justifyItems:"center",
width:"100%",
gap:"10px"
};
