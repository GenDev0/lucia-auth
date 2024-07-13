"use server";

import { z } from "zod";
import { signUpSchema } from "@/components/auth/sign-up-form";
import { signInSchema } from "@/components/auth/sign-in-form";

export const signUp = async (values: z.infer<typeof signUpSchema>) => {};

export const signIn = async (values: z.infer<typeof signInSchema>) => {};
