import { currentUser } from "@clerk/nextjs/server"
import { SignUpButton } from "@clerk/nextjs"
import prisma from "../lib/prisma"
import { claimUsername, addLink, deleteLink } from "./actions"

export default async function Home() {
  const user = await currentUser()

  // State 1: Logged out - Show landing page
  if (!user) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-white">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-black leading-tight mb-6">
            One link for all<br />your links
          </h1>
          <p className="text-xl md:text-2xl text-[#6B7280] max-w-2xl mx-auto mb-10">
            Create your personal page and share everything you create, curate, and sell — in one simple link.
          </p>
          <SignUpButton mode="modal">
            <button className="bg-[#FFDD00] hover:bg-[#f5d400] text-black font-semibold text-lg px-8 py-4 rounded-full transition-colors cursor-pointer shadow-sm">
              Start my free page
            </button>
          </SignUpButton>
          <p className="text-[#6B7280] text-sm mt-4">
            It&apos;s free and takes less than a minute ✨
          </p>
        </section>

        {/* Features Section */}
        <section className="bg-[#F7F7F7] py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-16">
              Everything in one place
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5]">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-black mb-2">Simple & Clean</h3>
                <p className="text-[#6B7280]">
                  No clutter. Just your links, beautifully displayed.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5]">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-black mb-2">Fast Setup</h3>
                <p className="text-[#6B7280]">
                  Create your page in under a minute. No coding required.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5]">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-black mb-2">Mobile Ready</h3>
                <p className="text-[#6B7280]">
                  Looks great on any device, anywhere, anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Ready to simplify your links?
            </h2>
            <SignUpButton mode="modal">
              <button className="bg-[#FFDD00] hover:bg-[#f5d400] text-black font-semibold text-lg px-8 py-4 rounded-full transition-colors cursor-pointer shadow-sm">
                Get started — it&apos;s free
              </button>
            </SignUpButton>
          </div>
        </section>
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
      <main className="min-h-[calc(100vh-80px)] bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
              Welcome aboard!
            </h1>
            <p className="text-[#6B7280] text-lg">
              Let&apos;s set up your personal page
            </p>
          </div>
          
          <div className="bg-[#F7F7F7] rounded-2xl p-8 border border-[#E5E5E5]">
            <form action={claimUsername}>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-black mb-3"
              >
                Choose your username
              </label>
              <div className="flex items-center mb-3">
                <span className="text-[#6B7280] bg-white px-4 py-4 rounded-l-xl border border-r-0 border-[#E5E5E5] text-sm">
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
                  className="flex-1 bg-white border border-[#E5E5E5] rounded-r-xl px-4 py-4 text-black placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent"
                />
              </div>
              <p className="text-[#6B7280] text-sm mb-6">
                Letters, numbers, and underscores only. Min 3 characters.
              </p>
              <button
                type="submit"
                className="w-full bg-[#FFDD00] hover:bg-[#f5d400] text-black font-semibold py-4 px-8 rounded-full transition-colors cursor-pointer"
              >
                Claim my page →
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  // State 3: Has DB profile - Show dashboard
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#F7F7F7]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#FFDD00] rounded-full flex items-center justify-center text-2xl font-bold">
              {(dbUser.name || dbUser.username).charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black">
                Hey, {dbUser.name || dbUser.username}! 👋
              </h1>
              <p className="text-[#6B7280]">
                linksmachine.com/<span className="font-medium text-black">{dbUser.username}</span>
              </p>
            </div>
          </div>
          <a
            href={`/${dbUser.username}`}
            className="inline-flex items-center gap-2 bg-[#F7F7F7] hover:bg-[#E5E5E5] text-black font-medium px-5 py-2.5 rounded-full transition-colors text-sm"
          >
            View my page →
          </a>
        </div>

        {/* Links Section */}
        <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] mb-6">
          <h2 className="text-xl font-bold text-black mb-6">My Links</h2>
          
          {/* Add Link Form */}
          <form action={addLink} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="title"
                placeholder="Title"
                required
                className="flex-1 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-4 py-3 text-black placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent"
              />
              <input
                type="url"
                name="url"
                placeholder="https://example.com"
                required
                className="flex-1 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-4 py-3 text-black placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-[#FFDD00] hover:bg-[#f5d400] text-black font-semibold px-6 py-3 rounded-full transition-colors cursor-pointer whitespace-nowrap"
              >
                + Add
              </button>
            </div>
          </form>
          
          {/* Links List */}
          {dbUser.links.length === 0 ? (
            <div className="text-center py-12 bg-[#F7F7F7] rounded-xl">
              <div className="text-4xl mb-3">🔗</div>
              <p className="text-[#6B7280] mb-1">No links yet</p>
              <p className="text-[#9CA3AF] text-sm">Add your first link above!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {dbUser.links.map((link) => (
                <li
                  key={link.id}
                  className="bg-[#F7F7F7] border border-[#E5E5E5] p-4 rounded-xl flex items-center justify-between group hover:border-[#FFDD00] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-black truncate">{link.title}</p>
                    <p className="text-sm text-[#6B7280] truncate">{link.url}</p>
                  </div>
                  <form action={deleteLink} className="ml-4">
                    <input type="hidden" name="linkId" value={link.id} />
                    <button
                      type="submit"
                      className="text-[#9CA3AF] hover:text-red-500 transition-colors cursor-pointer p-2"
                    >
                      🗑️
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5]">
          <h2 className="text-xl font-bold text-black mb-6">Profile</h2>
          <dl className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[#E5E5E5]">
              <dt className="text-[#6B7280]">Username</dt>
              <dd className="font-medium text-black">@{dbUser.username}</dd>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[#E5E5E5]">
              <dt className="text-[#6B7280]">Email</dt>
              <dd className="font-medium text-black">{dbUser.email}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[#6B7280]">Member since</dt>
              <dd className="font-medium text-black">
                {dbUser.createdAt.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  )
}
