import Hero from "../components/Hero"
import Features from "../components/Features"

export default function Home() {
  return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <Hero />
        <Features />
      </div>
  )
}