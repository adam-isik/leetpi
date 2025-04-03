import Link from "next/link"
import { PiIcon as PiCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row px-4 md:px-6">
        <div className="flex items-center gap-2">
          <PiCircle className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold">LeetPi</span>
        </div>
        <p className="text-center text-sm text-gray-500 md:text-left">
          © {new Date().getFullYear()} LeetPi. A satirical project. No mathematicians were harmed in the making of this
          website.
        </p>
        <div className="flex gap-4">
          <Link href="/about" className="text-sm text-gray-500 hover:underline underline-offset-4">
            About
          </Link>
        </div>
      </div>
    </footer>
  )
}

