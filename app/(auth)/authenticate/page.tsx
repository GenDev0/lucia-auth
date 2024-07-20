import { GoogleOauthButton } from "@/components/auth/google-oauth-button";
import SignInForm from "@/components/auth/sign-in-form";
import SignUpForm from "@/components/auth/sign-up-form";
import TabSwitcher from "@/components/tab-switcher";

type Props = {};
const AuthenticatePage = (props: Props) => {
  return (
    <div className='relative flex w-full h-screen bg-background'>
      <div className='max-w-3xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='flex justify-center items-center my-4'>
          <GoogleOauthButton />
        </div>
        <div className='flex justify-center items-center my-4'>OR</div>
        <TabSwitcher SignInTab={<SignInForm />} SignUpTab={<SignUpForm />} />
      </div>
    </div>
  );
};
export default AuthenticatePage;
