import prisma from "../lib/prisma"

export default async function Home() {
  let users: Array<{
    id: number
    email: string
    name: string | null
    createdAt: Date
    updatedAt: Date
  }> = []
  let error = null

  try {
    users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (e) {
    console.error("Error fetching users:", e)
    error = "Failed to load users. Make sure your DATABASE_URL is configured."
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-emerald-400">
          Users from Database
        </h1>
        {error ? (
          <p className="text-red-400 bg-red-950/50 p-4 rounded-lg border border-red-800">
            {error}
          </p>
        ) : users.length === 0 ? (
          <div className="text-zinc-400 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <p className="mb-4">No users yet.</p>
            <p className="text-sm">
              Create one using the API at{" "}
              <code className="bg-zinc-800 px-2 py-1 rounded text-emerald-400">
                /api/users
              </code>
            </p>
            <pre className="mt-4 bg-zinc-800 p-4 rounded text-sm overflow-x-auto">
{`curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","name":"Test User"}'`}
            </pre>
          </div>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg hover:border-emerald-800 transition-colors"
              >
                <p className="font-semibold text-lg text-zinc-100">
                  {user.name || "No name"}
                </p>
                <p className="text-sm text-zinc-400">{user.email}</p>
                <p className="text-xs text-zinc-600 mt-2">
                  Created: {user.createdAt.toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
