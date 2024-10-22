import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

type Props = {
  formId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FormPublishSuccess = (props: Props) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your form has been published successfully!</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default FormPublishSuccess;
