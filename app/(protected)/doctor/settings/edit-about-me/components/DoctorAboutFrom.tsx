"use client";

import * as z from "zod";
import React, {
  useState,
  useRef,
  useEffect,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { DoctorAboutMeSchema } from "@/schemas";
import { useSession } from "next-auth/react";
import { editAboutMe } from "@/actions/doctor-about-me/editAboutMe";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { Doctor } from "@/next-auth";

const AutoResizeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<"textarea">
>((props, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(
    null
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [props.value]);

  return (
    <Textarea
      {...props}
      ref={(e) => {
        textareaRef.current = e;
        if (typeof ref === "function") ref(e);
        else if (ref) ref.current = e;
      }}
    />
  );
});

AutoResizeTextarea.displayName = "AutoResizeTextarea";

const DoctorAboutForm = ({
  doctor,
}: {
  doctor: Doctor;
}) => {
  const { update } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState("");

  const [error, setError] = useState<string | undefined>(
    ""
  );
  const [success, setSuccess] = useState<
    string | undefined
  >("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof DoctorAboutMeSchema>>(
    {
      resolver: zodResolver(DoctorAboutMeSchema),
      defaultValues: {
        aboutMe: doctor?.aboutMe,
        specialties: doctor?.specialties,
        certifications: doctor?.certifications,
        professionalExperience:
          doctor?.professionalExperience,
        languages: doctor?.languages,
      },
    }
  );

  const onSubmit = (
    values: z.infer<typeof DoctorAboutMeSchema>
  ) => {
    setIsEditing(false);
    setEditingField("");

    startTransition(async () => {
      try {
        const data = await editAboutMe(values);

        if (data.success) {
          setSuccess(data.success);

          await update();
        }

        if (data.error) {
          setError(data.error);
        }
      } catch {
        setError("Something went wrong!");
      }
    });
  };

  const handleEdit = (
    field: keyof z.infer<typeof DoctorAboutMeSchema>
  ) => {
    setIsEditing(true);
    setEditingField(field);
  };

  const renderField = (
    label: string,
    name: keyof z.infer<typeof DoctorAboutMeSchema>
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-lg font-semibold text-labelColor flex justify-between items-center">
            {label}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(name)}
              className="text-primaryColor hover:text-primaryColor/80"
            >
              <Pencil size={18} />
            </Button>
          </FormLabel>
          <FormControl>
            {isEditing && editingField === name ? (
              <AutoResizeTextarea
                {...field}
                className="w-full bg-inputBg border-inputBorder placeholder-placeholder resize-none overflow-hidden"
              />
            ) : (
              <p className="text-textGray whitespace-pre-wrap">
                {field.value}
              </p>
            )}
          </FormControl>
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 px-mobileX py-mobileY"
      >
        {renderField("About Me", "aboutMe")}
        {renderField("Specialties", "specialties")}
        {renderField("Certifications", "certifications")}
        {renderField(
          "Professional Experience",
          "professionalExperience"
        )}
        {renderField("Languages", "languages")}

        <FormError message={error} />
        <FormSuccess message={success} />

        {isEditing && (
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primaryColor hover:bg-primaryColor/80 text-babyPowder"
          >
            Save Changes
          </Button>
        )}
      </form>
    </Form>
  );
};

export default DoctorAboutForm;
