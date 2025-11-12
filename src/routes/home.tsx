import { Button, Heading, Text, TextField, Theme } from '@radix-ui/themes';
import { useEffect, useRef, useState } from 'react';
import styles from './home.module.scss';

export function meta() {
	return [
		{ title: 'Budgeto – Modern Budgeting for Techies' },
		{
			name: 'description',
			content:
				'Take control of your finances with Budgeto. Modern, private, and launching soon!',
		},
	];
}

const Home = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const modalRef = useRef<HTMLDivElement>(null);

	// Trap focus in modal when open
	useEffect(() => {
		if (!modalOpen) return;
		const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		const first = focusable?.[0];
		first?.focus();
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setModalOpen(false);
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [modalOpen]);

	return (
		<Theme appearance='dark' accentColor='jade' radius='large'>
			<div className={styles.marketingRoot}>
				<section className={styles.hero}>
					<div className={styles.logo} aria-hidden='true'>
						<svg
							width='56'
							height='56'
							viewBox='0 0 56 56'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<circle cx='28' cy='28' r='28' fill='#4ade80' />
							<text
								x='28'
								y='36'
								textAnchor='middle'
								fontSize='2rem'
								fill='#fff'
								fontWeight='bold'
							>
								$
							</text>
						</svg>
					</div>
					<h1 className={styles.title}>Budgeto</h1>
					<p className={styles.subtitle}>
						The budget app for modern techies. Private, fast, and launching
						soon.
					</p>
				</section>
				<section className={styles.features} aria-label='Features'>
					<div className={styles.feature}>
						<Heading size='3' as='h2'>
							Track Every Dollar
						</Heading>
						<Text size='3'>
							See where your money goes, set budgets, and get instant insights.
						</Text>
					</div>
					<div className={styles.feature}>
						<Heading size='3' as='h2'>
							Smart Goals
						</Heading>
						<Text size='3'>
							Set savings goals and let Budgeto help you reach them faster.
						</Text>
					</div>
					<div className={styles.feature}>
						<Heading size='3' as='h2'>
							Privacy First
						</Heading>
						<Text size='3'>
							Your data is encrypted and never sold. You’re in control.
						</Text>
					</div>
				</section>

				<Button
					className={styles.notifyMe}
					size={'4'}
					type='button'
					onClick={() => setModalOpen(true)}
					aria-label='Notify me on launch'
				>
					Notify Me
				</Button>

				{/* Modal Dialog */}
				{modalOpen && (
					<div
						className={styles.modalOverlay}
						role='dialog'
						aria-modal='true'
						aria-label='Sign up for launch updates'
					>
						<div className={styles.modalBox} ref={modalRef} tabIndex={-1}>
							<button
								className={styles.modalClose}
								aria-label='Close'
								onClick={() => setModalOpen(false)}
								type='button'
								autoFocus
							>
								&times;
							</button>
							<h2
								style={{
									marginBottom: '1.5rem',
									fontSize: '2rem',
									fontWeight: 700,
								}}
							>
								Get Notified on Launch
							</h2>
							<form
								style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}
							>
								<label htmlFor='modal-email' className={styles.srOnly}>
									Email address
								</label>
								<TextField.Root
									type='email'
									id='modal-email'
									name='email'
									placeholder='Enter your email'
									required
									aria-label='Email address'
									size='3'
									style={{ width: '100%', marginBottom: '1.5rem' }}
								/>
								<Button size='3' type='submit' style={{ width: '100%' }}>
									Notify Me
								</Button>
							</form>
						</div>
					</div>
				)}
			</div>
		</Theme>
	);
};

export default Home;
