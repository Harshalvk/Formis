import React from "react";
import { getUserForms } from "@/app/actions/getUserForms";
import { MAX_FREE_FORMS } from "@/lib/utils";
import ProgressBar from "../ProgressBar";
import SubscribeBtn from "../Subscription/SubscribeBtn";
import { auth } from "@/auth";

type Props = {};

const UpgradeAccBtn = async (props: Props) => {
  const forms = await getUserForms();
  const formCount = forms.length;
  const percent = (formCount / MAX_FREE_FORMS) * 100;
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <div className="p-4 mb-4 text-sm">
      <ProgressBar value={percent} />
      <p>
        {formCount} out of {MAX_FREE_FORMS} forms generated
      </p>
      <p>
        <SubscribeBtn userId={userId} price={"22"} />
        for unlimited forms.
      </p>
    </div>
  );
};

export default UpgradeAccBtn;
