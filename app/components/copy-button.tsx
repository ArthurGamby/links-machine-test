"use client"

import { useState } from "react"

type Props = {
  url: string
}

export function CopyButton({ url }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-[#6B7280] hover:text-black text-sm transition-colors cursor-pointer"
    >
      {copied ? "✓ Copied!" : "📋 Copy link"}
    </button>
  )
}
