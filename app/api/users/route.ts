import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clerkId = searchParams.get("clerkId")

    // If clerkId is provided, find specific user
    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: { clerkId },
        include: { links: true },
      })
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
      return NextResponse.json(user)
    }

    // Otherwise return all users
    const users = await prisma.user.findMany({
      include: { links: true },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { clerkId, email, username, name } = body

    // Validate required fields
    if (!clerkId || !email || !username) {
      return NextResponse.json(
        { error: "clerkId, email, and username are required" },
        { status: 400 }
      )
    }

    // Validate username format
    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      )
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, and underscores" },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        clerkId,
        email,
        username: username.toLowerCase(),
        name: name || null,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)

    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Username or email already taken" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}
