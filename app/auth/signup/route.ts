import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, phone, password, role } = await request.json()

    // TODO: Replace with actual user creation logic
    // This is a mock implementation
    if (!name || !email || !phone || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Mock user creation - replace with database insert
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      name,
      phone,
      role,
      verification_status: role === "vendor" ? "incomplete" : "verified",
      bank_verified: false,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({ user: newUser })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
