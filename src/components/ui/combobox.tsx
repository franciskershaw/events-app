import React, { useEffect, useState } from "react";

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

import { useIsMobile } from "../../hooks/utility/use-mobile";
import { BasicSelect } from "./select";

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  role?: "search" | "add";
  onAddOption?: (newOption: string) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
  onBlur?: () => void;
  ref?: React.ForwardedRef<HTMLButtonElement>;
  modal?: boolean;
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      value,
      onChange,
      options,
      placeholder = "Select an option",
      role = "search",
      onAddOption,
      disabled = false,
      name,
      id,
      onBlur,
      modal = false,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [prevValue, setPrevValue] = useState(value);
    const isMobile = useIsMobile();

    const handleOpenChange = (newOpenState: boolean) => {
      if (newOpenState) {
        setPrevValue(value);
      } else {
        setSearchValue("");
        onChange(prevValue);
        if (onBlur) onBlur();
      }
      setOpen(newOpenState);
    };

    useEffect(() => {
      if (disabled && value) {
        onChange("");
      }
    }, [disabled, value, onChange]);

    if (isMobile) {
      return (
        <BasicSelect
          ref={ref}
          value={value}
          onChange={onChange}
          options={options}
          placeholder={placeholder}
          disabled={disabled}
          side="top"
          id={id}
          name={name}
          onBlur={onBlur}
          {...props}
        />
      );
    }

    return (
      <Popover modal={modal} open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            id={id}
            name={name}
            onBlur={onBlur}
            className={cn(
              "min-w-[140px] w-full truncate justify-start font-normal",
              !value && "text-muted-foreground",
              disabled && "cursor-not-allowed opacity-50"
            )}
            {...props}
          >
            <ChevronsUpDown className="h-4 w-4 flex-shrink-0" />
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto md:min-w-[250px] p-0"
          align="start"
          side="top"
        >
          <Command>
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              className="h-9"
              onValueChange={(searchValue) => {
                setSearchValue(searchValue);
              }}
              autoFocus={false}
            />
            <CommandList>
              <CommandEmpty>
                {role === "add" ? (
                  <button
                    className="text-accent hover:underline px-4"
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
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value);
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
  }
);

Combobox.displayName = "Combobox";

export { Combobox };
