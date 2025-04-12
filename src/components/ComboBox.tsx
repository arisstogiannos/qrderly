"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslations } from "next-intl"



export function AddLanguageComboBox<T extends Record<string, string>>({
    list,
    valueKey,
    labelKey,
    onSelect
  }: {
    list: T[];
    valueKey: keyof T;
    labelKey: keyof T;
    onSelect:(v:string)=>void
  }) {
    const formattedList = list.map((item) => ({
      value: item[valueKey],
      label: item[labelKey],
    }));
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
    const t = useTranslations("menu settings")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between font-normal"
        >
         { t("Add Language")}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput value={value} onValueChange={setValue} placeholder={t("Search Language")} className="h-9" />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {formattedList.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={onSelect}
                >
                  {item.label}
                 
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}



export function ComboBox<T extends Record<string, string>>({
    list,
    valueKey,
    labelKey,
    placeholder,
    onSelect,
    defaultValue
  }: {
    list: T[];
    placeholder:string;
    valueKey: keyof T;
    labelKey: keyof T;
    onSelect?:(v:string)=>void
    defaultValue?:string
  }) {
    const formattedList = list.map((item) => ({
      value: item[valueKey],
      label: item[labelKey],
    }));
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<undefined | string>(defaultValue)
   
    return (
        <>
        <input required type="hidden" defaultValue={value} name="defaultLanguage" />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between font-normal"
            >
            {value
              ? formattedList.find((item) => item.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command >
            <CommandInput   placeholder={placeholder} className="h-9" />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {formattedList.map((item) => (
                    <CommandItem
                    
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                    }}
                    >
                    {item.label}
                    <Check
                      className={cn(
                          "ml-auto",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                        />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
                </>
    )
  }