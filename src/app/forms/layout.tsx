import React from "react";

type Props = {
  children: React.ReactNode;
};

const FormEditLayout = ({ children }: Props) => {
  return (
    <main className="flex min-h-screen flex-col justify-between py-24">
      {children}
    </main>
  );
};

export default FormEditLayout;
