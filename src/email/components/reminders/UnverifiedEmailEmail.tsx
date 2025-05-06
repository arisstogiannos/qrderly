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
import { getTranslations } from "next-intl/server";
  
interface UnverifiedEmailProps {
    username: string;
    userEmail: string;
    verificationToken: string;
  }
  
  export default async function UnverifiedEmail ({
    username = "John",
    userEmail = "john@example.com",
    verificationToken = "https://www.scanby.cloud/verify-email",
  }: UnverifiedEmailProps) {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://www.scanby.cloud";
    const confirmationLink = `${baseUrl}/account-verification?token=${verificationToken}`;
    const t = await getTranslations("emails.unverified");
  
    return (
      <Html>
        <Head />
        <Preview>{t("subject")}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Img src={`${baseUrl}/logo black.png`} width="60" height="40" alt="Scanby" style={logo} />
            <Heading style={h1}>{t("heading")}</Heading>
            <Text style={text}>{t("greeting", { username })}</Text>
            <Text style={text}>{t("message")}</Text>
            <Section style={buttonContainer}>
              <Button style={button} href={confirmationLink}>
                {t("button")}
              </Button>
            </Section>
            <Text style={text}>{t("support")}</Text>
            <Hr style={hr} />
            <Text style={footer}><Copyright /> Scanby 2025</Text>
            <Text style={footer}>This email was sent to {userEmail}</Text>
            <Section style={unsubscribeContainer}>
              <Text style={unsubscribeText}>{t("unsubscribeDesc")}</Text>   
              <Button style={unsubscribeButton} href={`${baseUrl}/unsubscribe?email=${userEmail}`}>{t("unsubscribe")}</Button>
            </Section>  
          </Container>
        </Body>
      </Html>
    );
    };

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

  const unsubscribeContainer = {
    textAlign: "center" as const,
    margin: "30px 0",
  };

  const unsubscribeText = {
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "16px 0",
  };

  const unsubscribeButton = {
    color: "#4b5563",
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
    