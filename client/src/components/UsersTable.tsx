import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { User } from '@/types/user';

export default function UsersTable({
	usersData,
	tableTitle,
}: {
	usersData: User[];
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
							Pseudo
						</TableHead>
						<TableHead className="text-white text-center">
							Email
						</TableHead>
						<TableHead className="text-white text-center">
							Role
						</TableHead>
						<TableHead className="text-white text-center">
							GameCoins
						</TableHead>
						<TableHead className="text-white text-center">
							PremiumCoins
						</TableHead>
						<TableHead className="text-white text-center">
							FreeCoins
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{usersData.map((data) => (
						<TableRow key={data.username}>
							<TableCell className="text-white text-center">
								{data.id}
							</TableCell>
							<TableCell className="text-white text-center">
								{data.username}
							</TableCell>
							<TableCell className="text-white text-center">
								{data.email}
							</TableCell>
							<TableCell className="text-white text-center">
								{data.role}
							</TableCell>
							<TableCell className="text-white text-center">
								{data.gameCoins}
							</TableCell>
							<TableCell className="text-white text-center">
								{data.premiumCoins}
							</TableCell>
							<TableCell className="text-white text-center">
								{data.freeCoins}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
