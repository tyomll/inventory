import AuthForm from "@/components/Auth/Form";
import React from "react";

const page = () => {
  return (
    <div className="w-dvw h-dvh flex items-center justify-center">
      <AuthForm form="login" />
    </div>
  );
};

export default page;
