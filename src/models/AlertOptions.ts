export default interface AlertOptions {
	message: string;
	type: 'error' | 'info' | 'success' | 'warning';
	lifetime?: number;
	id?: string;
}
