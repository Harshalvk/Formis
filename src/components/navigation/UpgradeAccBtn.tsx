import React from "react";
import Link from "next/link";
import { getUserForms } from "@/app/actions/getUserForms";
import { MAX_FREE_FORMS } from "@/lib/utils";
import ProgressBar from "../ProgressBar";

type Props = {};

const UpgradeAccBtn = async (props: Props) => {
  const forms = await getUserForms();
  const formCount = forms.length;
  const percent = (formCount / MAX_FREE_FORMS) * 100;

  return (
    <div className="p-4 mb-4 text-sm">
      <ProgressBar value={percent} />
      <p>
        {formCount} out of {MAX_FREE_FORMS} forms generated
      </p>
      <p>
        <Link href={"/setting"} className="underline">
          Upgrade your plan
        </Link>{" "}
        for unlimited forms.
      </p>
    </div>
  );
};

export default UpgradeAccBtn;
