import { prisma } from "@/lib/prisma";
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { cookies } from "next/headers";

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    name: "lucia-auth-cookie",
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const getUser = async () => {
  try {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value || null;
    if (!sessionId) {
      return null;
    }
    const { user, session } = await lucia.validateSession(sessionId);
    console.log("🚀 ~ getUser ~ session:", session);
    console.log("🚀 ~ getUser ~ user:", user);
    if (session && session.fresh) {
      // refresh the session cookie
      const sessionCookie = await lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!session) {
      const sessionCookie = await lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        email: true,
        name: true,
        role: true,
        picture: true,
      },
    });
    return dbUser;
  } catch {
    return null;
  }
};
