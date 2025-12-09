"use server"

import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
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

export async function addLink(formData: FormData) {
  const user = await currentUser()

  if (!user) {
    throw new Error("You must be signed in")
  }

  const title = formData.get("title") as string
  const url = formData.get("url") as string

  if (!title || !url) {
    throw new Error("Title and URL are required")
  }

  // Find the user in our database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  })

  if (!dbUser) {
    throw new Error("User not found")
  }

  await prisma.link.create({
    data: {
      title,
      url,
      userId: dbUser.id,
    },
  })

  revalidatePath("/")
}

export async function deleteLink(formData: FormData) {
  const user = await currentUser()

  if (!user) {
    throw new Error("You must be signed in")
  }

  const linkId = formData.get("linkId") as string

  if (!linkId) {
    throw new Error("Link ID is required")
  }

  // Find the user in our database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  })

  if (!dbUser) {
    throw new Error("User not found")
  }

  // Delete the link (only if it belongs to the user)
  await prisma.link.deleteMany({
    where: {
      id: parseInt(linkId),
      userId: dbUser.id,
    },
  })

  revalidatePath("/")
}

