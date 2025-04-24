"use client";
import { Modal } from "@/app/[locale]/(business)/[businessName]/dashboard/_components/SharedComponents/Modal";
import { Button } from "@/components/ui/button";
import { plandata, productMap } from "@/data";
import { ExtendedUser, ProductURL } from "@/types";
import React, { ReactNode, useActionState } from "react";
import { ChooseTier } from "./ChooseTierModal";
import { createMenu } from "../actions";
import Loader from "@/components/Loader";
import { ErrorMessage } from "@/components/Messages";
import { ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";
import { Link as IntlLink } from "@/i18n/navigation";
import { MainButton } from "../../(landing page)/_sections/hero/MainButton";

export default function Publish({
  product,
  user,
  businessId,
}: {
  product: ProductURL;
  user: ExtendedUser;
  businessId: string;
}) {
  const selectedProduct = plandata.find(
    (p) => p.product === productMap[product]
  );

  const existingPaidSub = user.subscriptions.find(
    (s) =>
      (s.businessId == null || s.businessId === businessId) &&
      s.billing !== "FREETRIAL" &&
      s.product === productMap[product]
  );

  const publishedMenuBusiness = user.business.find(
    (b) => b.id === businessId && b.menu?.published
  );
  // console.log(existingPaidSub)

  const [state, action, isPending] = useActionState(
    existingPaidSub
      ? createMenu.bind(
          null,
          product,
          existingPaidSub.billing,
          existingPaidSub.businessId ?? ""
        )
      : createMenu.bind(null, product, "FREETRIAL", ""),
    null
  );

  if (!selectedProduct) return <div>invalid product</div>;

  let render: ReactNode;
  if (state?.success || publishedMenuBusiness) {
    render = (
      <Success
        url={
          !!state
            ? state?.businessNameUrl +
              (product === "qr-menu"
                ? "/menu"
                : "/smart-menu?table=" + state.adminEncryptedTableId)
            : publishedMenuBusiness?.name.replaceAll(" ", "-") +
              (product === "qr-menu" ? "/menu" : "/smart-menu?table=admin")
        }
      />
    );
  } else if (isPending) {
    render = (
      <div className="w-full md:min-w-lg flex flex-col items-center pt-10 min-h-80">
        <Loader className="h-16 mt-7" />
      </div>
    );
  } else if (!state?.error) {
    render = (
      <ChooseTier
        plan={selectedProduct}
        user={user}
        businessId={businessId}
        action={action}
      />
    );
  }

  return (
    <Modal
      title={
        !isPending && !state?.success && !publishedMenuBusiness ? "Publish" : ""
      }
      subtitle={
        !isPending && !state?.success && !publishedMenuBusiness
          ? "Choose tier to procced"
          : ""
      }
      classNames=" lg:w-fit min-w-fit pt-5"
      trigger={
        <form
          className="ml-auto w-full sm:w-fit mt-auto "
          action={existingPaidSub ? action : ""}
        >
          <MainButton
            type={
              existingPaidSub && !state?.success && !publishedMenuBusiness
                ? "submit"
                : "button"
            }
            className=" max-2xl:text-xl w-full sm:w-fit "
          >
            <span className="w-full flex-center gap-x-3">
              {state?.success ? (
                "View"
              ) : (
                <>
                  {" "}
                  <Rocket /> Publish
                </>
              )}
            </span>
          </MainButton>
        </form>
      }
    >
      {render}
      {state?.error && <ErrorMessage msg={state.error} />}
    </Modal>
  );
}

function Success({ url }: { url: string }) {
  return (
    <div className="flex flex-col items-center gap-y-8">
      <div className="flex flex-col items-center gap-y-1 text-center">
        <p className="text-4xl font-medium ">Successfuly Published!</p>
      </div>
      <div className="flex flex-col gap-3 lg:flex-row pb-5 lg:pb-0">
        <Button size={"lg"} asChild>
          <IntlLink
            href={{
              params: { businessName: url.split("/")[0] },
              pathname: "/[businessName]/dashboard",
            }}
            replace={true}
          >
            Dashboard <ArrowRight />
          </IntlLink>
        </Button>
        <Button size={"lg"} asChild>
          <Link href={"/en/" + url}>
            Menu <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}
