import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { formatErrorMessages } from "./zod-error-parser";

export function serverErrorHandler(error: Error | ZodError | unknown) {
  if (error instanceof z.ZodError) {
    return new NextResponse(
      `Validation Error : ${formatErrorMessages(error)}`,
      {
        status: 500,
      }
    );
  }

  return new NextResponse("Internal Error", { status: 500 });
}
