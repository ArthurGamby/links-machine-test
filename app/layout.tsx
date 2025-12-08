import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Links Machine',
  description: 'Create your personal link hub. Share all your important links in one place.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="light">
        <body className={`${nunito.variable} font-sans antialiased bg-white text-black`}>
          <header className="flex justify-between items-center px-6 py-4 max-w-5xl mx-auto">
            <a href="/" className="text-xl font-bold">
              🔗 Links Machine
            </a>
            <nav className="flex items-center gap-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-[#6B7280] hover:text-black font-medium px-4 py-2 rounded-full transition-colors cursor-pointer">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-[#FFDD00] hover:bg-[#f5d400] text-black font-semibold px-6 py-2.5 rounded-full transition-colors cursor-pointer">
                    Sign up free
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </SignedIn>
            </nav>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
