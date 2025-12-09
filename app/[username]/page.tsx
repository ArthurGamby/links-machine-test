import { notFound } from "next/navigation"
import prisma from "../../lib/prisma"
import { CopyButton } from "../components/copy-button"

type Props = {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    include: { links: true },
  })

  if (!user) {
    notFound()
  }

  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://linksmachine.com"}/${user.username}`

  return (
    <main className="min-h-screen py-12 px-6 flex items-start justify-center">
      <div className="w-full max-w-md">
        {/* Profile Card */}
        <div className="card text-center">
          {/* Avatar */}
          <div className="w-24 h-24 bg-[#FFDD00] rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
            {(user.name || user.username).charAt(0).toUpperCase()}
          </div>
          
          {/* Name & Username */}
          <h1 className="text-2xl font-bold text-black">
            {user.name || `@${user.username}`}
          </h1>
          {user.name && (
            <p className="text-[#6B7280]">@{user.username}</p>
          )}
          
          {/* Copy Button */}
          <div className="mt-3 mb-8">
            <CopyButton url={profileUrl} />
          </div>

          {/* Links */}
          {user.links.length > 0 ? (
            <ul className="space-y-3">
              {user.links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-[#F7F7F7] hover:bg-[#FFDD00] border border-[#E5E5E5] hover:border-[#FFDD00] text-center py-4 px-6 rounded-full font-semibold text-black transition-all"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-[#6B7280]">
              No links yet
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[#6B7280] hover:text-black text-sm transition-colors"
          >
            🔗 Create your own Links Machine
          </a>
        </div>
      </div>
    </main>
  )
}
