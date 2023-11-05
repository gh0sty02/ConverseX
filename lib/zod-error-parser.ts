import * as z from "zod";

export function formatErrorMessages(err: z.ZodError): string {
  const errorMessages: string[] = [];
  const errorObj = err.flatten().fieldErrors;

  for (const field in errorObj) {
    if (errorObj.hasOwnProperty(field)) {
      errorMessages.push(`${field} is ${errorObj[field]}`);
    }
  }

  return errorMessages.join(", ");
}
