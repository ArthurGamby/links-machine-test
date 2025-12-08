import { currentUser } from "@clerk/nextjs/server"
import { SignInButton } from "@clerk/nextjs"
import prisma from "../lib/prisma"
import { claimUsername } from "./actions"

export default async function Home() {
  const user = await currentUser()

  // State 1: Logged out - Show landing page
  if (!user) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Links Machine
          </h1>
          <p className="text-xl text-zinc-400 mb-10">
            Create your personal link hub. Share all your important links in one place.
          </p>
          <SignInButton mode="modal">
            <button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 px-8 rounded-lg text-lg transition-colors cursor-pointer">
              Sign In to Get Started
            </button>
          </SignInButton>
        </div>
      </main>
    )
  }

  // Check if user has a profile in our database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { links: true },
  })

  // State 2: Logged in but no DB profile - Show claim username form
  if (!dbUser) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 w-full">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
            <h1 className="text-2xl font-bold mb-2 text-zinc-100">
              Claim Your Username
            </h1>
            <p className="text-zinc-400 mb-6">
              Choose a unique username for your public profile.
            </p>
            <form action={claimUsername}>
              <div className="mb-6">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Username
                </label>
                <div className="flex items-center">
                  <span className="text-zinc-500 bg-zinc-800 px-3 py-3 rounded-l-lg border border-r-0 border-zinc-700">
                    linksmachine.com/
                  </span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="yourname"
                    required
                    minLength={3}
                    pattern="^[a-zA-Z0-9_]+$"
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-r-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Minimum 3 characters. Letters, numbers, and underscores only.
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
              >
                Claim Username
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  // State 3: Has DB profile - Show dashboard
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-400">
            Welcome, {dbUser.name || dbUser.username}!
          </h1>
          <p className="text-zinc-400 mt-2">
            Your profile: <span className="text-emerald-400 font-mono">linksmachine.com/{dbUser.username}</span>
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-zinc-100">Your Links</h2>
          {dbUser.links.length === 0 ? (
            <p className="text-zinc-400">
              You haven&apos;t added any links yet. Start building your link hub!
            </p>
          ) : (
            <ul className="space-y-3">
              {dbUser.links.map((link) => (
                <li
                  key={link.id}
                  className="bg-zinc-800 border border-zinc-700 p-4 rounded-lg"
                >
                  <p className="font-medium text-zinc-100">{link.title}</p>
                  <p className="text-sm text-zinc-400 truncate">{link.url}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3 text-zinc-300">Profile Info</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex">
              <dt className="text-zinc-500 w-24">Username:</dt>
              <dd className="text-zinc-300">{dbUser.username}</dd>
            </div>
            <div className="flex">
              <dt className="text-zinc-500 w-24">Email:</dt>
              <dd className="text-zinc-300">{dbUser.email}</dd>
            </div>
            <div className="flex">
              <dt className="text-zinc-500 w-24">Joined:</dt>
              <dd className="text-zinc-300">{dbUser.createdAt.toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  )
}
