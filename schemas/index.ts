import { UserRole } from "@prisma/client";
import * as z from "zod";

export const DoctorSpecializationSchema = z.object({
  specialization: z.string().optional(),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(8, {
      message: "Minimum 8 characters required",
    }),
    passwordConfirm: z.string().min(8, {
      message: "Password confirmation is required",
    }),
    role: z.enum([UserRole.PATIENT, UserRole.DOCTOR]),
  })
  .extend({
    specialization: z.string().optional(),
  })
  .refine(
    (data) => data.password === data.passwordConfirm,
    {
      message: "Passwords don't match",
      path: ["passwordConfirm"],
    }
  )
  .refine(
    (data) => {
      if (data.role === UserRole.DOCTOR) {
        return !!data.specialization;
      }
      return true;
    },
    {
      message: "Specialization is required for doctors",
      path: ["specialization"],
    }
  );

// export const RoleSelectionSchema = z
//   .object({
//     role: z.enum([UserRole.PATIENT, UserRole.DOCTOR]),
//   })
//   .merge(DoctorSpecializationSchema)
//   .refine(
//     (data) => {
//       if (data.role === UserRole.DOCTOR) {
//         return !!data.specialization;
//       }
//       return true;
//     },
//     {
//       message: "Specialization is required for doctors",
//       path: ["specialization"],
//     }
//   );

export const RoleSelectionSchema = z
  .object({
    role: z.enum([UserRole.PATIENT, UserRole.DOCTOR]),
    specialization: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === UserRole.DOCTOR) {
        return !!data.specialization;
      }
      return true;
    },
    {
      message: "Specialization is required for doctors",
      path: ["specialization"],
    }
  );

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z
  .object({
    password: z.string().min(8, {
      message: "Minimum of 8 characters required",
    }),
    passwordConfirm: z.string().min(8, {
      message: "Password confirmation is required",
    }),
  })
  .refine(
    (data) => data.password === data.passwordConfirm,
    {
      message: "Passwords don't match",
      path: ["passwordConfirm"],
    }
  );

export const emailChangeSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" }),
});

export const passwordChangeSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine(
    (data) => data.newPassword === data.confirmNewPassword,
    {
      message: "Passwords don't match",
      path: ["confirmNewPassword"],
    }
  );

export const DoctorAboutMeSchema = z
  .object({
    aboutMe: z
      .string()
      .min(1, "About Me is required")
      .optional(),
    specialties: z
      .string()
      .min(1, "Specialties are required")
      .optional(),
    certifications: z
      .string()
      .min(1, "Certifications are required")
      .optional(),
    professionalExperience: z
      .string()
      .min(1, "Professional Experience is required")
      .optional(),
    languages: z
      .string()
      .min(1, "Languages are required")
      .optional(),
  })
  .refine(
    (data) =>
      Object.values(data).some(
        (value) => value !== undefined
      ),
    {
      message: "At least one field must be filled out",
    }
  );

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),
  avatar: z
    .any()
    .refine(
      (file) => !file || file instanceof File,
      "Avatar must be a file or empty"
    )
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "Max file size is 5MB."
    )
    .refine(
      (file) =>
        !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .png, and .webp formats are supported."
    )
    .optional(),
  country: z.string().optional(),
  city: z.string().optional(),
});
