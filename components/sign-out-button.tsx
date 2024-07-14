"use client";

import { logout } from "@/app/(auth)/authenticate/auth.action";
import { Button, ButtonProps } from "./ui/button";

type SignOutButtonProps = ButtonProps & {
  children: React.ReactNode;
};
const SignOutButton = ({ children, ...props }: SignOutButtonProps) => {
  return (
    <Button onClick={() => logout()} {...props}>
      {children}
    </Button>
  );
};
export default SignOutButton;
