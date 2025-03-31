import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { CornerDotType, CornerSquareType, DotType } from "qr-code-styling";
export default function QrShape({setCornerDotsShape,setCornerSquareShape,setShape,shape,cornerDotShape,cornerSquareShape}:{shape:DotType,cornerDotShape:CornerDotType,cornerSquareShape:CornerSquareType,setShape:(v:DotType)=>void,setCornerDotsShape:(v:CornerDotType)=>void,setCornerSquareShape:(v:CornerSquareType)=>void}) {
  return (
    <><div className="space-y-2">
    <Label htmlFor="shape">Dot Shape:</Label>
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
        <SelectItem value="square">Square</SelectItem>
        <SelectItem value="dots">Dots</SelectItem>
        <SelectItem value="rounded">Rounded</SelectItem>
        <SelectItem value="classy">Classy</SelectItem>
        <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
        <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
      </SelectContent>
    </Select>
  </div>
  <div className="space-y-2">
    <Label htmlFor="cornerDotsShape">Corner Dots Shape:</Label>
    <Select
      name="cornerDotsShape"
      value={cornerDotShape}
      onValueChange={(e) => setCornerDotsShape(e as DotType)}
    >
      <SelectTrigger className="min-w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="square">Square</SelectItem>
        <SelectItem value="dots">Dots</SelectItem>
        <SelectItem value="rounded">Rounded</SelectItem>
        <SelectItem value="classy">Classy</SelectItem>
        <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
        <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <div className="space-y-2">
    <Label htmlFor="cornerSquareShape">Corner Square Shape:</Label>
    <Select
    value={cornerSquareShape}
      name="cornerSquareShape"
      onValueChange={(e) => setCornerSquareShape(e as DotType)}
    >
      <SelectTrigger defaultValue={"sqare"} className="min-w-40">
        <SelectValue defaultValue={"square"}/>
      </SelectTrigger>
      <SelectContent defaultValue={"square"}>
        <SelectItem value="square">Square</SelectItem>
        <SelectItem value="dots">Dots</SelectItem>
        <SelectItem value="rounded">Rounded</SelectItem>
        <SelectItem value="classy">Classy</SelectItem>
        <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
        <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
      </SelectContent>
    </Select>
  </div></>
  )
}
