import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CTA() {
    return (
        <section className="py-20 text-center bg-blue-600 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
            <p className="text-xl mb-8">Join thousands of players and start your daily challenge now!</p>
            <Button asChild variant="secondary">
                <Link href="#signup">Sign Up for Free</Link>
            </Button>
        </section>
    )
}

