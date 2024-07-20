"use client";

import { logout } from "@/app/(auth)/authenticate/auth.action";
import { Button, ButtonProps } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type SignOutButtonProps = ButtonProps & {
  children: React.ReactNode;
};
const SignOutButton = ({ children, ...props }: SignOutButtonProps) => {
  return (
    <Button onClick={() => logout()} {...props}>
      {children}

      <LogOut className='ml-2' />
    </Button>
  );
};
export default SignOutButton;
