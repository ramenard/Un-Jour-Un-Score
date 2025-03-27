import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

const features = [
	{
		title: 'Défis Quotidiens',
		description: 'Un nouveau jeu chaque jour pour vous tenir engagé',
	},
	{
		title: 'Classement Mondial',
		description: 'Affrontez des joueurs du monde entier',
	},
	{
		title: 'Des jeux de random',
		description: 'Un système de score équitable et équilibré',
	},
];

export default function Features() {
	return (
		<section className="py-8">
			<h2 className="nes-text is-disabled text-3xl font-bold text-center mb-10">
				Fonctionnalités du site
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
				{features.map((feature, index) => (
					<Card key={index}>
						<CardHeader>
							<CardTitle>{feature.title}</CardTitle>
							<CardDescription>
								{feature.description}
							</CardDescription>
						</CardHeader>
					</Card>
				))}
			</div>
		</section>
	);
}
