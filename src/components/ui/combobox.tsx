import { useEffect, useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  role?: "search" | "add";
  onAddOption?: (newOption: string) => void;
  disabled?: boolean;
}

const Combobox = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  role = "search",
  onAddOption,
  disabled = false,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (disabled && value) {
      onChange("");
    }
  }, [disabled, value, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "min-w-[140px] truncate justify-start font-normal",
            !value && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <ChevronsUpDown className="mr-2 h-4 w-4 flex-shrink-0" />
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" side="top">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="h-9"
            onValueChange={(searchValue) => {
              setSearchValue(searchValue);
            }}
          />
          <CommandList>
            <CommandEmpty>
              {role === "add" ? (
                <button
                  className="text-blue-500 hover:underline px-4"
                  onClick={() => {
                    if (onAddOption) {
                      onAddOption(searchValue);
                    }
                  }}
                >
                  Add "{searchValue}" +
                </button>
              ) : (
                <span>No options found.</span>
              )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
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
};

export { Combobox };
