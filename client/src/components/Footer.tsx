import Link from 'next/link';

export default function Footer() {
	return (
		<footer className="bg-gray-100 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
				<p>&copy; 2025 Un jour, un score. Tout droits réservés.</p>
				<nav>
					<ul className="flex space-x-4">
						<li>
							<Link href="#privacy" className="hover:underline">
								Privacy Policy
							</Link>
						</li>
						<li>
							<Link href="#terms" className="hover:underline">
								Terms of Service
							</Link>
						</li>
						<li>
							<Link href="#contact" className="hover:underline">
								Contact
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</footer>
	);
}
