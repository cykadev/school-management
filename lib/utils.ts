import * as z from "zod";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateSingleFormFieldZod = (
  field: string,
  value: string,
  schema: z.ZodObject,
  currentFieldErrors: Record<string, unknown>
) => {

  const result = schema.safeParse({ [field]: value });
  const newErrors = { ...currentFieldErrors };

  if (!result.success) {
    const { fieldErrors }: { fieldErrors: Record<string, unknown> } = z.flattenError(result.error);
    newErrors[field] = fieldErrors[field];
  } else {
    delete newErrors[field];
  }

  if (JSON.stringify(newErrors) !== JSON.stringify(currentFieldErrors)) {
    return newErrors;
  }

  return null;

};
