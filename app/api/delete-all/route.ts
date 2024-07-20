import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    // Delete all rows from the Session table
    await prisma.session.deleteMany({});

    // Delete all rows from the User table
    await prisma.user.deleteMany({});
    return new NextResponse("All rows were succefully deleted", {
      status: 200,
    });
  } catch (error: any) {
    console.log("🚀 ~ Delete ~ error:", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
