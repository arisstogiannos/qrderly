import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import type { CornerDotType, CornerSquareType, DotType } from "qr-code-styling";
export default function QrShape({
  setCornerDotsShape,
  setCornerSquareShape,
  setShape,
  shape,
  cornerDotShape,
  cornerSquareShape,
}: {
  shape: DotType;
  cornerDotShape: CornerDotType;
  cornerSquareShape: CornerSquareType;
  setShape: (v: DotType) => void;
  setCornerDotsShape: (v: CornerDotType) => void;
  setCornerSquareShape: (v: CornerSquareType) => void;
}) {
  const t = useTranslations("qr settings.qr shape");
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="shape">{t("shape")}:</Label>
        <Select
          required
          name="dotShape"
          value={shape}
          onValueChange={(e) => setShape(e as DotType)}
        >
          <SelectTrigger className="min-w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="square">{t("square")}</SelectItem>
            <SelectItem value="dots">{t("dots")}</SelectItem>
            <SelectItem value="rounded">{t("rounded")}</SelectItem>
            <SelectItem value="classy">{t("classy")}</SelectItem>
            <SelectItem value="classy-rounded">
              {t("classy rounded")}
            </SelectItem>
            <SelectItem value="extra-rounded">{t("extra rounded")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cornerDotsShape">{t("cornerDotsShape")}:</Label>
        <Select
          name="cornerDotsShape"
          value={cornerDotShape}
          onValueChange={(e) => setCornerDotsShape(e as DotType)}
        >
          <SelectTrigger className="min-w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="square">{t("square")}</SelectItem>
            <SelectItem value="dots">{t("dots")}</SelectItem>
            <SelectItem value="rounded">{t("rounded")}</SelectItem>
            <SelectItem value="classy">{t("classy")}</SelectItem>
            <SelectItem value="classy-rounded">
              {t("classy rounded")}
            </SelectItem>
            <SelectItem value="extra-rounded">{t("extra rounded")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cornerSquareShape">{t("cornerSquareShape")}:</Label>
        <Select
          value={cornerSquareShape}
          name="cornerSquareShape"
          onValueChange={(e) => setCornerSquareShape(e as DotType)}
        >
          <SelectTrigger defaultValue={"sqare"} className="min-w-40">
            <SelectValue defaultValue={"square"} />
          </SelectTrigger>
          <SelectContent defaultValue={"square"}>
            <SelectItem value="square">{t("square")}</SelectItem>
            <SelectItem value="dots">{t("dots")}</SelectItem>
            <SelectItem value="rounded">{t("rounded")}</SelectItem>
            <SelectItem value="classy">{t("classy")}</SelectItem>
            <SelectItem value="classy-rounded">
              {t("classy rounded")}
            </SelectItem>
            <SelectItem value="extra-rounded">{t("extra rounded")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
