import React from "react";
import { Button } from "./ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Session } from "next-auth";
import { Modal } from "@/app/[locale]/(business)/[businessName]/dashboard/_components/SharedComponents/Modal";
import { useModalContext } from "@/context/ModalProvider";
import { Product } from "@prisma/client";
import { productMapURL } from "@/data";

export default function CreateMenuBtn({
  session,
}: {
  session: Session | null;
}) {
  const t = useTranslations("createMenuBtn");
  if (!session) return null;

  const { business, subscriptions } = session.user;

  const paidUnPublishedSub = subscriptions.find(
    (sub) =>
      sub.billing !== "FREETRIAL" &&
      (!sub.businessId ||
        !business.find((b) => b.id === sub.businessId)?.menu.published)
  );



  return (
     !paidUnPublishedSub ? (
        <Button asChild className="lg:bg-foreground ml-2 p-4 mr-2  text-lg">
          <Link href={"/get-started"} className="">
            {t("createMenu")}
          </Link>
        </Button>
      ) : (
        <Modal
          title={t("modalTitle", {
            product: paidUnPublishedSub.product.replaceAll("_", " "),
          })}
          subtitle={t("modalSubtitle", {
            product: paidUnPublishedSub.product.replaceAll("_", " ").toLowerCase(),
          })}
          trigger={
            <Button className="lg:bg-foreground ml-2 p-4 mr-2  text-lg">
              {t("createMenu")}
            </Button>
          }
        >
          <ModalContent product={paidUnPublishedSub.product} />
        </Modal>
      )
  );
}

function ModalContent({ product }: { product: Product }) {
  const { setOpen } = useModalContext();
  const t = useTranslations("createMenuBtn");

  const urlParam = productMapURL[product];
  return (
    <div className="space-x-4 mt-6 ml-auto">
      <Button onClick={() => setOpen(false)} asChild variant={"outline"}>
        <Link
          href={{
            pathname: "/get-started",
          }}
          className=" text-muted-foreground"
        >
          {t("createDifferentMenu")}
        </Link>
      </Button>
      <Button onClick={() => setOpen(false)} asChild>
        <Link
          href={{
            pathname: "/get-started/[product]/business-setup",
            params: { product: urlParam },
          }}
          className=""
        >
          {t("continue")}
        </Link>
      </Button>
    </div>
  );
}
