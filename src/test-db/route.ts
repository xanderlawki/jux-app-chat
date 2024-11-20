import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const user = await User.create({ username: "test_user" });

  return NextResponse.json(user);
}
