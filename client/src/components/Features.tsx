import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const features = [
    { title: "Daily Challenges", description: "New game every day to keep you engaged" },
    { title: "Global Leaderboard", description: "Compete with players worldwide" },
    { title: "Random-based Scoring", description: "Fair and balanced scoring system" },
]

export default function Features() {
  return (
    <section className="py-20">
      <h2 className="nes-text is-disabled text-3xl font-bold text-center mb-10">Game Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
