import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

const page = () => {
  return (
    <div className="h-screen nax-w-4xl flex items-center justify-center">
      <Alert variant="default" className="max-w-4xl">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your account has been updated.{" "}
          <Link href="/view-forms" className="underline">
            Go to the dashboard
          </Link>{" "}
          to create more forms
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default page;
