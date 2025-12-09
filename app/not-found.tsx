import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold text-black mb-4">
          404
        </h1>
        <p className="text-xl text-[#6B7280] mb-8 max-w-md mx-auto">
          Oops! This page doesn&apos;t exist. Maybe the link was moved or mistyped.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#FFDD00] hover:bg-[#f5d400] text-black font-semibold px-8 py-4 rounded-full transition-colors"
        >
          ← Go home
        </Link>
      </div>
    </main>
  )
}
