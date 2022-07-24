import { useState, useCallback, useEffect } from 'preact/hooks';

export function useHashChange(): string {
	const [currentHash, setCurrentHash] = useState(
		globalThis.location ? globalThis.location.hash.slice(1) || '' : '',
	);

	const handleHashChange = useCallback(() => {
		if (!globalThis.location) return;

		const { hash } = globalThis.location;

		setCurrentHash(hash ? hash.slice(1) : '');
	}, []);

	useEffect(() => {
		globalThis.addEventListener('hashchange', handleHashChange);

		return (): void => {
			globalThis.removeEventListener('hashchange', handleHashChange);
		};
	}, []);

	return currentHash;
}
