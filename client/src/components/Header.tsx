import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Header() {
    return (
        <header className="bg-white shadow">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="nes-theme font-bold text-xl">
                    Un jour, un score
                </Link>
                <div className="nes-theme">
                    <Button asChild className="mr-2">
                        <Link href="#login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="#signup">Sign Up</Link>
                    </Button>
                </div>
            </nav>
        </header>
    )
}

