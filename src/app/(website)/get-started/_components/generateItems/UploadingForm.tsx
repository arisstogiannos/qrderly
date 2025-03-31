"use client";

import { useActionState, useEffect, useState } from "react";
import Uploader from "./Uploader";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { ArrowRight } from "lucide-react";
import { extractMenuItemsFromImage } from "@/ai";
import { ErrorMessage } from "@/components/Messages";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

export default function UploadingForm({
  businessName,
}: {
  businessName: string;
}) {
  const [file, setFile] = useState<File>();
  const [state, action, isPending] = useActionState(
    extractMenuItemsFromImage.bind(null, businessName),
    null
  );
  const router = useRouter()

  useEffect(() => {
    if (state?.error) {
      setFile(undefined);
    }
  }, [state?.error]);

  return (
    <form
      action={action}
      className="flex flex-col items-center justify-center gap-y-10 "
    >
      <Dialog open={isPending}>
        <DialogContent closeable={false}>
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-center">
              Our AI is proccessing your menu. This will take a few seconds.
            </DialogTitle>
          </DialogHeader>
          <Loader className="h-12 text-sm mx-auto" />
        </DialogContent>
      </Dialog>
      <div className=" grid lg:grid-cols-2 gap-10">
        <Uploader
          uploadedFile={file}
          onUpload={setFile}
          fileType="image/"
          placeholder="/image-placeholder.png"
          title="image"
          description="Upload a png file from your device for the best results. You can also upload a picture of your camera but it needs to be clear"
        />
        <Uploader
          uploadedFile={file}
          onUpload={setFile}
          fileType="application/pdf"
          placeholder="/pdf-placeholder.png"
          title="pdf"
          description="Upload a png file from your device for the best results. You can also upload a picture of your camera but it needs to be clear"
        />
      </div>
      <div className="w-full flex justify-between items-center">
        {state?.error && <ErrorMessage msg={state?.error} />}
<div className="ml-auto space-x-5">

        <Button
          type="button"
          className=" w-fit  text-lg rounded-full p-1 min-w-24 mt-auto"
          onClick={()=>router.push("customize-qr")}
          >
          Skip <ArrowRight className="size-5" />
        </Button>
        <Button
          disabled={isPending || !file}
          type="submit"
          className="bg-foreground w-fit  text-lg rounded-full p-1 min-w-24 mt-auto"
          formAction={action}
          >
          Next <ArrowRight className="size-5" />
        </Button>
          </div>
      </div>
    </form>
  );
}
