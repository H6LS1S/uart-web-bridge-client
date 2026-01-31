import { HISTORY_KEY } from './history.constants';

/**
 *
 */
export class HistoryService extends Array<string> {
	/**
	 *
	 * @private
	 */
	private index: number = this.length;

	/**
	 *
	 */
	constructor() {
		const storage = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
		super(...storage);
	}

	/**
	 *
	 * @param command
	 */
	public write(command: string): void {
		if (this.includes(command)) return;
		if (this.length > 100) this.shift();

		this.push(command);
		this.index = this.length;
		localStorage.setItem(HISTORY_KEY, JSON.stringify(this));
	}

	/**
	 *
	 */
	public up(): string {
		this.index = (this.index - 1 + this.length) % this.length;
		return this[this.index] || '';
	}

	/**
	 *
	 */
	public down(): string {
		this.index = (this.index + 1) % this.length;
		return this[this.index] || '';
	}
}
