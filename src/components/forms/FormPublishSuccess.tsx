import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { CopyIcon, Link2Icon } from "lucide-react";
import { toast } from "sonner";

type Props = {
  formId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FormPublishSuccess = (props: Props) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(baseUrl + "/forms/" + props.formId)
      .then(() => toast.success("Copied to clipborad"))
      .catch((error) => alert("Failed to copy to clipboard"));
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your form has been published successfully!</DialogTitle>
          <DialogDescription>
            Your form is now live and ready to be filled out by your users. You
            can now share using the link below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <p>Copy link</p>
        </div>
        <div className="border-2 border-gray-200 flex justify-between items-center pl-2 rounded-md">
          <Link2Icon className="mr-2" />
          <input
            type="text"
            placeholder="Link"
            disabled
            value={`${baseUrl}/forms/${props.formId}`}
            className="w-full outline-none bg-transparent"
          />
          <Button onClick={copyToClipboard}>
            <CopyIcon />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormPublishSuccess;
