"use server"

import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "../lib/prisma"

export async function claimUsername(formData: FormData) {
  const user = await currentUser()

  if (!user) {
    throw new Error("You must be signed in to claim a username")
  }

  const username = formData.get("username") as string

  // Validate username
  if (!username || username.length < 3) {
    throw new Error("Username must be at least 3 characters")
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error("Username can only contain letters, numbers, and underscores")
  }

  // Check if user already has a profile
  const existingProfile = await prisma.user.findUnique({
    where: { clerkId: user.id },
  })

  if (existingProfile) {
    throw new Error("You already have a profile")
  }

  // Create the user in the database
  await prisma.user.create({
    data: {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      username: username.toLowerCase(),
      name: user.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : null,
    },
  })

  redirect("/")
}

