import SignOutButton from "@/components/sign-out-button";
import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";

type Props = {};
const DashboardPage = async (props: Props) => {
  const user = await getUser();
  console.log("🚀 ~ DashboardPage ~ user:", user);
  if (!user) {
    return redirect("/authenticate");
  }
  return (
    <>
      <div>You are now logged in as {user.email}</div>
      <SignOutButton
        variant={"secondary"}
        className='flex justify-center items-center gap-4'
      >
        SignOut
        <LogOut />
      </SignOutButton>
    </>
  );
};
export default DashboardPage;
