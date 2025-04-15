import Image from "next/image";
import React from "react";
import { ProductURL } from "@/types";

import { checkUser } from "../../isAllowed";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Publish from "../../_components/Publish";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  ExternalLink,
  Eye,
  Lightbulb,
  QrCode,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function page({
  params,
}: {
  params: Promise<{ product: ProductURL }>;
}) {
  const product = (await params).product;
  const t = await getTranslations("publish");
  if (!product) notFound();

  const result = await checkUser(product);

  if (!result) {
    redirect("/get-started/" + product + "/business-setup");
  }
  if (result?.redirect === "businessWithoutMenu") {
    redirect("/get-started/" + product + "/menu-settings");
  }

  if (result.redirect === "noQR") {
    redirect("/get-started/" + product + "/customize-qr");
  }
  // if (result.redirect === "noUnsetBusiness") {
  //   redirect("/get-started/" + product + "/business-setup");
  // }

  return (
    <div className="">
      <div className="max-w-4xl mx-auto">
        {/* Confetti-style header */}
        <div className="relative mb-12 text-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-64 h-64 rounded-full bg-green-200 blur-3xl"></div>
            <div className="w-64 h-64 rounded-full bg-amber-200 blur-3xl -ml-20"></div>
          </div>

          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Your Menu is Ready to Go Live!
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              You're just one step away from having your digital menu accessible
              to your customers. Launch your menu and start delighting your
              guests!
            </p>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className=" bg-accent p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Preview Menu</h3>
              <p className="text-slate-500 text-sm mb-4">
                Take a final look at your menu before publishing
              </p>
              <Button variant="outline" className="w-full">
                Preview <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className=" bg-accent p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-3 rounded-full mb-4">
                <QrCode className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">QR Code Ready</h3>
              <p className="text-slate-500 text-sm mb-4">
                Your unique QR code will be generated on publish
              </p>
              <div className="border-2 border-dashed border-slate-200 p-4 rounded-lg w-full flex justify-center">
                <div className="w-16 h-16 bg-slate-100 flex items-center justify-center rounded">
                  <QrCode className="h-8 w-8 text-slate-400" />
                </div>
              </div>
            </div>
          </Card>

          <Card className=" bg-accent p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Smartphone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Mobile Optimized</h3>
              <p className="text-slate-500 text-sm mb-4">
                Your menu looks great on all devices
              </p>
              <div className="border-2 border-slate-200 rounded-xl w-12 h-20 flex items-center justify-center">
                <div className="w-8 h-14 bg-slate-100 rounded"></div>
              </div>
            </div>
          </Card>
        </div> */}

        {/* Tip Box */}
        <Card className="  mb-12 overflow-hidden border-amber-200 bg-gradient-to-r from-yellow-50 to-yellow-100 py-0">
          <div className="p-4 flex items-start gap-4">
            <div className="shrink-0 bg-amber-200 p-2 rounded-full">
              <Lightbulb className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Pro Tip</h3>
              <p className="text-amber-800">
                After publishing, visit your menu items page to ensure
                everything is generated correctly. Our AI is powerful, but it's
                always good to review the results. You can manually edit and fix whatever you need with our easy to use interface.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 items-end">
                <span className="text-amber-800">
                  Review:
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800">
                  Items belong to right category
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800">
                  Prices
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-amber-800">
                  Names / Descriptions
                </span>
             
              </div>
            </div>
          </div>
        </Card>
        <Publish
          businessId={result.business.id}
          product={product}
          user={result.user}
        />
        {/* Publish Button */}
      </div>
    </div>
  );
}
