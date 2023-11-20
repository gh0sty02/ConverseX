import { SignIn } from "@clerk/nextjs";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ConverseX | Login",
  description: "Log in to ConverseX",
};

export default function Page() {
  return (
    <div>
      <SignIn />
    </div>
  );
}
