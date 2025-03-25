import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { LeaderboardData } from '@/types/leaderboard';

export default function Leaderboard({
	leaderBoardData,
	isCurrentUserMode,
	tableTitle,
}: {
	leaderBoardData: LeaderboardData[];
	isCurrentUserMode: boolean;
	tableTitle: string;
}) {
	return (
		<div className="flex flex-col items-start w-1/3">
			<span className="text-white self-center text-lg font-bold">
				{tableTitle}
			</span>
			<Table className="border-white">
				<TableHeader>
					<TableRow>
						<TableHead className="text-white text-center">
							Rank
						</TableHead>
						<TableHead className="text-white text-center">
							Name
						</TableHead>
						<TableHead className="text-white text-center">
							Score
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isCurrentUserMode && (
						<TableRow>
							<TableCell className="text-white">...</TableCell>
							<TableCell className="text-white">...</TableCell>
							<TableCell className="text-white">...</TableCell>
						</TableRow>
					)}
					{leaderBoardData.map((data) => (
						<TableRow key={data.username}>
							<TableCell className="text-white">
								{data.rankScore}
							</TableCell>
							<TableCell className="text-white">
								{data.username}
							</TableCell>
							<TableCell className="text-white">
								{data.score}
							</TableCell>
						</TableRow>
					))}
					{isCurrentUserMode && (
						<TableRow>
							<TableCell className="text-white">...</TableCell>
							<TableCell className="text-white">...</TableCell>
							<TableCell className="text-white">...</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
