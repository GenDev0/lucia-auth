"use server";

import { z } from "zod";
import { Argon2id } from "oslo/password";

import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/components/auth/sign-up-form";
import { signInSchema } from "@/components/auth/sign-in-form";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signUp = async (values: z.infer<typeof signUpSchema>) => {
  try {
    console.log("Server Side SignUp action", values);
    const existingUser = await prisma.user.findUnique({
      where: {
        email: values.email,
      },
    });
    if (existingUser) {
      throw new Error("Email already in use");
    }
    const hashedPassword = await new Argon2id().hash(values.password);
    const user = await prisma.user.create({
      data: {
        name: values.name,
        email: values.email,
        hashedPassword,
      },
    });
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return { success: true };
  } catch (error: any) {
    console.log("🚀 ~ signUp ~ error:", error);
    return { error: error.message || "Something went wrong !", success: false };
  }
};

export const signIn = async (values: z.infer<typeof signInSchema>) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: values.email,
      },
    });
    if (!user || !user?.hashedPassword) {
      throw new Error("Invalid credentials!");
    }
    const passwordMatch = await new Argon2id().verify(
      user.hashedPassword,
      values.password
    );
    if (!passwordMatch) {
      throw new Error("Invalid credentials!");
    }
    // successful login
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Something went wrong !", success: false };
  }
};

export const logout = async () => {
  const sessionCookie = await lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/authenticate");
};
