import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
    return (
        <section className="py-20 text-center">
            <h1 className="nes-text is-disabled text-5xl font-bold mb-4">Un jour, un score</h1>
            <p className="nes-text is-disabled text-xl mb-8">Challenge yourself daily with our unique scoring game!</p>
            <Button asChild>
                <Link href="#play">Play Now</Link>
            </Button>
        </section>
    )
}

