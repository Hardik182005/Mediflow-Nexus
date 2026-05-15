import checkDatabase from "@/lib/db-check";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const info = await checkDatabase();
    return NextResponse.json({ status: "success", message: info.message, info });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
