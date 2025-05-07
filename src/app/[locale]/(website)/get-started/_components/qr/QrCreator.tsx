"use client";
import {
  useState,
  useEffect,
  useRef,
  useActionState,
} from "react";
import QRCodeStyling, { CornerDotType, CornerSquareType, DotType, Options } from "qr-code-styling";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { ArrowRight, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { saveQR } from "../../actions";
import type { BusinessExtended, ProductURL } from "@/types";
import Loader from "@/components/Loader";

import QrDownLoad from "./QrDownLoad";
import QrShape from "./QrShape";
import QeColors from "./QeColors";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
export default function QrCreator({
  url,
  business,
  product,
}: {
  url: string;
  business: BusinessExtended;
  product?: ProductURL;
}) {
  const initialOptions:Options  = business.qr?.qrOptions ? JSON.parse( business.qr.qrOptions) : null 
  const qrRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("qr settings");
  const [bgColor, setBgColor] = useState(initialOptions?.backgroundOptions?.color??"#ffffff");
  const [text, setText] = useState(business.qr?.text??"Scan Me!");
  const [shape, setShape] = useState<DotType>(initialOptions?.dotsOptions?.type??"square");
  const [cornerSquareShape, setCornerSquareShape] = useState<CornerSquareType>(initialOptions?.cornersSquareOptions?.type??"square");
  const [cornerDotsShape, setCornerDotsShape] = useState<CornerDotType>(initialOptions?.cornersDotOptions?.type??"square");
  const [logo, setLogo] = useState("");
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [dotColor, setDotColor] = useState(initialOptions?.dotsOptions?.color??"#000000");
  const [showColorWarning, setShowColorWarning] = useState(false);
  

  const qrOptions = {
    width: 300,
    height: 300,
    type: "canvas",
    data: url,
    image: logo,
    shape: "square",
    margin: 10,
    cornersSquareOptions: { type: cornerSquareShape },
    cornersDotOptions: { type: cornerDotsShape },
    dotsOptions: {
      color: dotColor,
      type: shape,
      
    },
    backgroundOptions: {
      color: bgColor,
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 15,
    },
  } as Options;

  const [state, action, isPending] = useActionState(
    saveQR.bind(null, business.id,  qrOptions,text,product),
    null
  );

  useEffect(() => {
    if (bgColor !== "#ffffff") {
      setShowColorWarning(true);
    } 
  }, [ bgColor]);

  useEffect(() => {
    console.log(state)
    if (state?.success) {

      toast.success(state.success);
    }
  }, [state]);

  useEffect(() => {
    const qr = new QRCodeStyling(qrOptions);
    setQrCode(qr);
  }, [dotColor, bgColor, shape, logo, cornerDotsShape, cornerSquareShape]);

  useEffect(() => {
    if (qrCode && qrRef.current) {
      qrRef.current.innerHTML = ""; // Clear old QR code
      qrCode.append(qrRef.current);

      // Wait for the QR code to be generated
      setTimeout(() => {
        const canvas = qrRef.current?.querySelector("canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 300 - 15, canvas.width, canvas.height + 40);
        canvas.style.backgroundColor = bgColor;
        // Add text to the canvas

        // canvas.style.borderRadius="40px"

        ctx.font = "bold 14px Arial";
        ctx.fillStyle = dotColor; // Text color
        if (business.product === "SMART_QR_MENU") {
          ctx.textAlign = "right";
          ctx.fillText("table", canvas.width - 5, canvas.height - 3); // Position text
        }
        ctx.textAlign = "left";
        ctx.fillText(text, 5, canvas.height - 3, (canvas.width * 3) / 4); // Position text
        canvas.style.backgroundColor = bgColor;
      }, 100);
    }
  }, [qrCode, text]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <form action={action} className="mt-2  flex flex-col gap-y-5">
      <Dialog open={showColorWarning} onOpenChange={setShowColorWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("color warning.title")}</DialogTitle>
            <DialogDescription>
              {t("color warning.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setBgColor("#ffffff");setShowColorWarning(false);		}}>{t("color warning.close")}</Button>
            <Button variant="default" onClick={() => setShowColorWarning(false)}>{t("color warning.continue")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex gap-4 flex-wrap">
        <QrShape
          cornerDotShape={cornerDotsShape}
          shape={shape}
          cornerSquareShape={cornerSquareShape}
          setCornerDotsShape={setCornerDotsShape}
          setCornerSquareShape={setCornerSquareShape}
          setShape={setShape}
        />
      </div>
      <div className="flex w-full gap-5  flex-wrap">
        <QeColors
          bgColor={bgColor}
          dotColor={dotColor}
          setBgColor={setBgColor}
          setDotColor={setDotColor}
        />
        <div className="space-y-2">
          <Label htmlFor="logo">
            {t("logo")} <span className="text-muted-foreground">({t("optional")})</span>
          </Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            placeholder="Logo URL (optional)"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="Text">
          {t("text")} <span className="text-muted-foreground">({t("optional")})</span>
        </Label>
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Text"
        />
      </div>

      <div className="space-y-4 sm:max-w-[320px] w-full">
        <div ref={qrRef} className="bg-gray-100  inline-block "/>
        <QrDownLoad text={text} business={business} qrCode={qrCode} />
      </div>

      <Button
        disabled={isPending}
        type="submit"
        className="bg-foreground w-full sm:w-fit ml-auto text-lg rounded-lg sm:rounded-full p-1 min-w-24 mt-auto"
        formAction={action}
      >
        {isPending ? (
          <Loader />
        ) : product?(
          <>
            {t("Next")} <ArrowRight className="size-5" />
          </>
        ):(
          <>
            {t("Save")} <Save className="size-5" />
          </>
        )}
      </Button>
    </form>
  );
}
