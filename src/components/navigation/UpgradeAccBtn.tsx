import React from "react";
import { getUserForms } from "@/app/actions/getUserForms";
import { MAX_FREE_FORMS } from "@/lib/utils";
import ProgressBar from "../ProgressBar";
import SubscribeBtn from "../Subscription/SubscribeBtn";
import { auth } from "@/auth";
import { getUserSubscription } from "@/app/actions/userSubscriptions";

const UpgradeAccBtn = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  const subscription = await getUserSubscription({ userId });
  if (subscription) {
    return null;
  }
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
        <SubscribeBtn
          userId={userId}
          price={"price_1RqCxKSD8gEaTANG11BEsv4j"}
        />{" "}
        for unlimited forms.
      </p>
    </div>
  );
};

export default UpgradeAccBtn;
