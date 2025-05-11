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

interface QrMenuCreatedEmailProps {
  username: string;
  menuName: string;
  menuUrlPath: string;
  userEmail: string;
}

export const QrMenuCreatedEmail = async ({
  username = "John",
  menuName = "Summer Specials",
  menuUrlPath = "menu",
  userEmail = "user@example.com"
}: QrMenuCreatedEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://www.scanby.cloud";
  const menuUrl = `${baseUrl}/${menuName.replaceAll(" ", "-")}/${menuUrlPath}`;
  const dashboardUrl = `${baseUrl}/${menuName.replaceAll(" ", "-")}/dashboard`;
  const t = await getTranslations("emails.menuCreated");

  return (
    <Html>
      <Head />
      <Preview>{t("subject", { menuName })}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/logo black.png`}
            width="60"
            height="40"
            alt="QR Menu Creator"
            style={logo}
          />
          <Heading style={h1}>{t("heading")}</Heading>
          <Text style={text}>{t("greeting", { username })}</Text>
          <Text style={text}>{t("message", { menuName })}</Text>
          {/* <Section style={qrCodeContainer}>
            <Img
              src={qrCodeUrl}
              width="200"
              height="200"
              alt="QR Code"
              style={qrCode}
            />
          </Section> */}
          <Text style={text}>{t("customerInfo")}</Text>
          <Section style={buttonContainer}>
            <Button style={button} href={menuUrl}>
              {t("viewButton")}
            </Button>
          </Section>
          <Text style={text}>{t("updateInfo")}</Text>
          <Section style={buttonContainer}>
            <Button style={secondaryButton} href={dashboardUrl}>
              {t("dashboardButton")}
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            <Copyright /> Scanby 2025
          </Text>
          <Section style={unsubscribeContainer}>
              <Text style={unsubscribeText}>{t("unsubscribeDesc")}</Text>   
              <Button style={unsubscribeButton} href={`${baseUrl}/user-settings?email=${userEmail}`}>{t("unsubscribe")}</Button>
            </Section>
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
  display: "flex",
  alignItems: "center",
  justifyItems: "center",
  width: "100%",
  gap: "10px"
};
