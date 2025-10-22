import React from "react";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "../env-var-warning";
import { AuthButton } from "../auth-button";

const AuthButtonContainer = () => {
  return <div>{!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}</div>;
};

export default AuthButtonContainer;
