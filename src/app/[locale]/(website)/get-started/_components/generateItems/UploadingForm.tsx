"use client";

import { useActionState, useEffect, useState } from "react";
import Uploader from "./Uploader";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircleIcon, Upload } from "lucide-react";
import { ErrorMessage } from "@/components/Messages";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ProgressSteps from "./Progress";
import { Label } from "@/components/ui/label";
import { extractAllItems } from "@/ai/extractAllItems";
import { extractSomeItems } from "@/ai/extractSomeItems";
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { uploadImageClientSide } from "@/lib/utils";

export default function UploadingForm({
  businessName,
  existingItems,
  existingCategories,
}: {
  businessName: string;
  existingItems?: string[];
  existingCategories?: Category[];
}) {
  const [file, setFile] = useState<File>();
  const [cloudinaryPublicIDs, setCloudinaryPublicIDs] = useState<string[]>();
  const [state, action, isPending] = useActionState(
    existingItems && existingCategories 
      ? extractSomeItems.bind(
          null,
          businessName,
          existingCategories,
          existingItems,
          cloudinaryPublicIDs??[]
        )
      : extractAllItems.bind(null, businessName,cloudinaryPublicIDs??[]),
    null
  );
  const router = useRouter();
  const t = useTranslations("uploadingForm");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (state?.error) {
      setFile(undefined);
      setCloudinaryPublicIDs(undefined);
    }
    if (state?.success) {
      setFile(undefined);
      setCloudinaryPublicIDs(undefined);

      if (existingItems) {
        toast(t("toast", { newItems: state.noNewItems ?? 0 }), {
          duration: 10000,
          icon: <CheckCircleIcon />,
          position: "bottom-right",
          style: {
            backgroundColor: "#C9F8BB",
            color: "darkgreen",
            borderColor: "darkgreen",
          },
          closeButton: true,
        });
      } else {
        router.push("customize-qr");
      }
    }
  }, [state]);

  const handleUpload = async (selectedFiles: File[]) => {
    setFile(selectedFiles[0]);
    setIsUploading(true);
    try {
      const uploadedImageUrls = await Promise.all(
        selectedFiles.map((file) => file.type.includes("image/")? uploadImageClientSide(file):null).filter((file)=>file!==null)
      );
      setCloudinaryPublicIDs(uploadedImageUrls);
    } catch (error) {
      console.error("Cloudinary upload failed", error);
    }
    setIsUploading(false);
  };
  return (
    <form action={action} className="flex flex-col  justify-center gap-y-10 ">
      {/* {existingItems && <OverwriteExistingItemsSwitch />} */}
      <Dialog open={isPending}>
        <DialogContent closeable={false}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-left">
              {t("dialogTitle")}
            </DialogTitle>
          </DialogHeader>
          <ProgressSteps taskIsRunning={isPending} time={existingItems?3000:7000} />
          {/* <Loader className="h-12 text-sm mx-auto" /> */}
        </DialogContent>
      </Dialog>
      <div className=" grid lg:grid-cols-2 gap-10">
        <Uploader
          uploadedFile={file}
          onUpload={handleUpload}
          fileType="image/"
          placeholder="/image-placeholder.png"
          title={t("imageTitle")}
          description={t("imageDescription")}
          isUploading={isUploading}
        />
        <Uploader
          uploadedFile={file}
          onUpload={handleUpload}
          fileType="application/pdf"
          placeholder="/pdf-placeholder.png"
          title={t("pdfTitle")}
          description={t("pdfDescription")}
          isUploading={isUploading}
        />
      </div>
      <div className="w-full flex flex-col xl:flex-row gap-y-5 justify-between items-center">
        {existingItems ? (
          <Button
            disabled={isPending || !file || isUploading}
            type="submit"
            className="bg-foreground w-full sm:w-fit  text-lg py-5 sm:rounded-full p-1 min-w-24 mt-auto ml-auto"
            formAction={action}
          >
            {t("upload")} <Upload className="size-5" />
          </Button>
        ) : (
          <div className="sm:ml-auto w-full sm:w-fit space-y-2 space-x-5 ">
            <Button
              type="button"
              className=" w-full sm:w-fit  text-lg py-5 sm:rounded-full p-1 min-w-24 mt-auto"
              onClick={() => router.push("customize-qr")}
            >
              {t("skip")} <ArrowRight className="size-5" />
            </Button>
            <Button
              disabled={isPending || !file || isUploading}
              type="submit"
              className="bg-foreground w-full sm:w-fit  text-lg py-5 sm:rounded-full p-1 min-w-24 mt-auto"
              formAction={action}
            >
              {t("next")} <ArrowRight className="size-5" />
            </Button>
          </div>
        )}
        {state?.error && <ErrorMessage msg={state?.error} />}
      </div>
    </form>
  );
}

function OverwriteExistingItemsSwitch() {
  const t = useTranslations("uploadingForm");

  return (
    <div className=" space-y-2   border-b-2 border-background/10  ">
      <div className="flex flex-col ">
        <span className="text-foreground  capitalize  font-medium">
          {t("overwrite")}
        </span>
        <span className="  text-sm text-muted-foreground">
          {t("overwriteDesc")}
        </span>
      </div>
      <div className="flex gap-2">
        <Label className=" h-8 justify-center  text-sm  text-foreground/20 gap-2 border-2 border-foreground/20 px-2 py-2 rounded-lg cursor-pointer has-checked:border-primary has-checked:text-primary  text-center w-12">
          <input
            type="radio"
            defaultValue="no"
            defaultChecked={true}
            name={"overwrite"}
            className="peer hidden"
          />
          {t("no")}
        </Label>
        <Label className="  h-8 text-sm  text-foreground/20 gap-2 border-2 border-foreground/20 px-2 py-2 rounded-lg cursor-pointer has-checked:border-primary has-checked:text-primary text-center flex-center min-w-10 w-12">
          <input
            type="radio"
            defaultValue="yes"
            name={"overwrite"}
            className="peer hidden "
          />
          {t("yes")}
        </Label>
      </div>
    </div>
  );
}
