import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Game } from '@/types/game';

export default function GamesTable({
	gamesData,
	tableTitle,
}: {
	gamesData: Game[];
	tableTitle: string;
}) {
	return (
		<div className="flex flex-col items-start w-full">
			<span className="text-white self-center text-lg font-bold">
				{tableTitle}
			</span>
			<Table className="border-white">
				<TableHeader>
					<TableRow>
						<TableHead className="text-white text-center">
							ID
						</TableHead>
						<TableHead className="text-white text-center">
							Nom
						</TableHead>
						<TableHead className="text-white text-center">
							Description
						</TableHead>
						<TableHead className="text-white text-center">
							Activé
						</TableHead>
						<TableHead className="text-white text-center">
							Dernière activation
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{gamesData.map((data) => (
						<TableRow key={data.name}>
							<TableCell className="text-white text-center">
								{data.id}
							</TableCell>
							<TableCell className="text-white text-center">
								{data.name}
							</TableCell>
							<TableCell className="text-white text-center">
								{data.description}
							</TableCell>
							<TableCell className="text-white text-center">
								{data.isActive ? 'Actif' : 'Inactif'}
							</TableCell>
							<TableCell className="text-white text-center">
								{data.lastActivationDate
									? data.lastActivationDate.toDateString()
									: 'Jamais joué'}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
