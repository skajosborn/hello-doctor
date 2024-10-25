import React from "react";
import {
  FieldValues,
  UseFormReturn,
  Path,
  PathValue,
} from "react-hook-form";
import { UserRole } from "@prisma/client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface DoctorSpecializationFieldProps<
  T extends FieldValues
> {
  form: UseFormReturn<T>;
  activeRole: UserRole;
}

export function DoctorSpecializationField<
  T extends FieldValues
>({ form, activeRole }: DoctorSpecializationFieldProps<T>) {
  if (activeRole !== UserRole.DOCTOR) {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name={"specialization" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-labelColor">
            Specialization
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="Enter your medical specialization"
              type="text"
              className="text-textDark placeholder-placeholder"
              value={field.value as string}
              onChange={(e) =>
                field.onChange(
                  e.target.value as PathValue<T, Path<T>>
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
