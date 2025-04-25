// Updated UploadingForm to use Inngest
"use client";

import { useEffect, useState } from "react";
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
import { Category } from "@prisma/client";
import { toast } from "sonner";
import { uploadImageClientSide } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { inngest } from "@/inngest/client";
import { getRunOutput, InngestRun } from "@/inngest/status";
import { startExtractSomeItems, startInngestJobServerAction } from "@/inngest/actions";

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
  const [jobId, setJobId] = useState<string | null>(null);
  const [ingestRunResult, setIngestRunResult] = useState<InngestRun | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const t = useTranslations("uploadingForm");

  const handleUpload = async (selectedFiles: File[]) => {
    setFile(selectedFiles[0]);
    setIsUploading(true);
    try {
      const uploadedImageUrls = await Promise.all(
        selectedFiles
          .map((file) =>
            file.type.includes("image/") ? uploadImageClientSide(file) : uploadImageClientSide(file)
          )
          .filter((file) => file !== null)
      );
      setCloudinaryPublicIDs(uploadedImageUrls);
    } catch (error) {
      console.error("Cloudinary upload failed", error);
    }
    setIsUploading(false);
  };

  const startInngestJob = async () => {
    if (!cloudinaryPublicIDs?.length) return;
    setIsProcessing(true);
    const jobId = uuidv4();
    setJobId(jobId);

    try {
      let eventId: any;
      if(existingItems && existingCategories && existingItems.length > 0) {
        const {eventId:temp} = await startExtractSomeItems({
          businessName,
          cloudinaryPublicIDs,
          existingCategories,
          existingItems
        });
        eventId = temp
      }else{
        const {eventId:temp} = await startInngestJobServerAction({
          businessName,
          cloudinaryPublicIDs,
        });
        eventId = temp

      }
 

      console.log(eventId);

      const inngestJobOutput = await getRunOutput(eventId);

      setIngestRunResult(inngestJobOutput);

      if (!existingItems && inngestJobOutput.status === "Timeout") {
        router.push("customize-qr");
      }
      if (existingItems && inngestJobOutput.status === "Completed") {
        toast(t("toast", { newItems: inngestJobOutput.output.noNewItems }), {
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
      } else if (inngestJobOutput.status === "Completed") {
        router.push("customize-qr");
      }
    } catch (err) {
      console.error("Error in Inngest job", err);
    }
    setIsProcessing(false);
    setFile(undefined);
    setCloudinaryPublicIDs(undefined);
    setJobId(null);
  };

  return (
    <form className="flex flex-col justify-center gap-y-10">
      <Dialog open={!!jobId}>
        <DialogContent closeable={false}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-left">
              {t("dialogTitle")}
            </DialogTitle>
          </DialogHeader>
          <ProgressSteps
            taskIsRunning={isProcessing}
            time={
              existingItems && existingItems.length > 0
                ? (cloudinaryPublicIDs?.length ?? 1) * 1000 + 3000
                : (cloudinaryPublicIDs?.length ?? 1) * 1000 + 7000
            }
          />
        </DialogContent>
      </Dialog>

      <div className="grid lg:grid-cols-2 gap-10">
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
            disabled={isUploading || !file || isProcessing}
            type="button"
            className="bg-foreground w-full sm:w-fit text-lg py-5 sm:rounded-full p-1 min-w-24 mt-auto ml-auto"
            onClick={startInngestJob}
          >
            {t("upload")} <Upload className="size-5" />
          </Button>
        ) : (
          <div className="sm:ml-auto w-full sm:w-fit space-y-2 space-x-5">
            <Button
              type="button"
              className="w-full sm:w-fit text-lg py-5 sm:rounded-full p-1 min-w-24 mt-auto"
              onClick={() => router.push("customize-qr")}
            >
              {t("skip")} <ArrowRight className="size-5" />
            </Button>
            <Button
              disabled={isUploading || !file || isProcessing}
              type="button"
              className="bg-foreground w-full sm:w-fit text-lg py-5 sm:rounded-full p-1 min-w-24 mt-auto"
              onClick={startInngestJob}
            >
              {t("next")} <ArrowRight className="size-5" />
            </Button>
          </div>
        )}
        {ingestRunResult?.status === "Failed" ||
          (ingestRunResult?.status === "Cancelled" && (
            <ErrorMessage msg={ingestRunResult.error} />
          ))}
      </div>
    </form>
  );
}
