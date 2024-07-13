"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabSwitcherProps = {
  SignInTab: React.ReactNode;
  SignUpTab: React.ReactNode;
};

const TabSwitcher = ({ SignInTab, SignUpTab }: TabSwitcherProps) => {
  return (
    <Tabs defaultValue='sign-in' className='w-[500px]'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='sign-in'>Sign In</TabsTrigger>
        <TabsTrigger value='sign-up'>Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value='sign-in'>{SignInTab}</TabsContent>
      <TabsContent value='sign-up'>{SignUpTab}</TabsContent>
    </Tabs>
  );
};
export default TabSwitcher;
