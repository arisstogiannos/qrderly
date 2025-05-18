"use client";
import { Modal } from "../../(business)/[businessName]/dashboard/_components/SharedComponents/Modal";
import { useTranslations } from "next-intl";
import RegisterForm from "./RegisterForm";

export default function AuthModal({open, setOpen,redirectUrl}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  redirectUrl:string
}) {
  const t = useTranslations("registerPage");

  return (
    <Modal 
      title={t("title")} 
      subtitle={t("subtitle")} 
      trigger={null} 
      openParent={open} 
      setOpenParent={setOpen} 
      showDesc 
      classNames="pt-5"
    >
      <RegisterForm redirectUrl={redirectUrl} />
    </Modal>
  );
}
