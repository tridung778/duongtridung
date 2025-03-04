"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type DataType = {
  code: string;
  name: string;
};

type ComboboxProps = {
  datas?: DataType[];
  setValue: (value: string) => void;
  value: string;
};

export function Combobox({ datas = [], setValue, value }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between"
        >
          {value ? datas.find((data) => data.code === value)?.name : "Chọn đài"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Đang chọn đài ...." className="h-9" />
          <CommandList>
            <CommandEmpty>Không tìm thấy đài này.</CommandEmpty>
            <CommandGroup heading="Đài">
              {datas.map((data) => (
                <CommandItem
                  key={data.code}
                  value={data.code}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {data.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === data.code ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
