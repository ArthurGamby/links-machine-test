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
    <main className="min-h-screen bg-[#F7F7F7] py-12 px-6">
      <div className="max-w-lg mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#FFDD00] rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
            {(user.name || user.username).charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-black">
            {user.name || `@${user.username}`}
          </h1>
          {user.name && (
            <p className="text-[#6B7280]">@{user.username}</p>
          )}
          {/* Copy Button */}
          <div className="mt-3">
            <CopyButton url={profileUrl} />
          </div>
        </div>

        {/* Links */}
        {user.links.length > 0 ? (
          <ul className="space-y-4 mb-12">
            {user.links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white border border-[#E5E5E5] hover:border-[#FFDD00] hover:shadow-md text-center py-4 px-6 rounded-full font-semibold text-black transition-all"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 mb-12">
            <p className="text-[#6B7280]">No links yet</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
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
