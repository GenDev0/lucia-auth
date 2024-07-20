import { prisma } from "@/lib/prisma";
import { google } from "@/lib/googleOauth";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { lucia } from "@/lib/lucia";
import { redirect } from "next/navigation";

//http://localhost:3000/api/auth/google/callback
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    console.error("no code or state");
    return new Response("Invalid request !", { status: 400 });
  }

  const codeVerifier = cookies().get("codeVerifier")?.value;
  const savedState = cookies().get("state")?.value;

  if (!codeVerifier || !savedState) {
    console.error("no code Verifier or state");
    return new Response("Invalid request !", { status: 400 });
  }

  if (state !== savedState) {
    console.error("Foreign request!");
    return new Response("Invalid request !", { status: 400 });
  }

  const { accessToken } = await google.validateAuthorizationCode(
    code,
    codeVerifier
  );

  const googleResponse = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const googleData = (await googleResponse.json()) as {
    id: string;
    email: string;
    name: string;
    picture: string;
  };

  const existingUser = await prisma.user.findUnique({
    where: {
      email: googleData.email,
    },
  });

  let userId: string = "";
  if (existingUser) {
    //IF email exists in our record,
    //create a cookie and sign in
    userId = existingUser.id;
  } else {
    //IF email does not exists in our record,
    //create a new user , a cookie and then  sign in
    const user = await prisma.user.create({
      data: {
        name: googleData.name,
        email: googleData.email,
        picture: googleData.picture,
      },
    });
    userId = user.id;
  }

  const session = await lucia.createSession(userId, {});
  const sessionCookie = await lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  // return redirect("/dashboard");
  return new Response(
    `<script>
      window.opener.location.href = "/dashboard";
      window.close();
    </script>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}
