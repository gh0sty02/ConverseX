import { ZodError } from "zod";

export function formatErrorMessages(err: ZodError): string {
  const errorMessages: string[] = [];
  const errorObj = err.flatten().fieldErrors;

  for (const field in errorObj) {
    if (errorObj.hasOwnProperty(field)) {
      errorMessages.push(`${field} is ${errorObj[field]}`);
    }
  }

  return errorMessages.join(", ");
}
