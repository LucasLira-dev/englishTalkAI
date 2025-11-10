import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Practice API: use /api/practice (POST) to create sessions and /api/evaluateAttempt (POST) to evaluate attempts.",
  });
}
