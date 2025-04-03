import Link from "next/link"
import { PiIcon as PiCircle } from "lucide-react"

export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <PiCircle className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">LeetPi</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}

