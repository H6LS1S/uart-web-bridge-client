import { type Subscriber } from 'svelte/store';

import { CONSOLE_KEY } from './console.constants';

/**
 *
 * @param timestamp
 * @param command
 */
const pr = ({ timestamp, command }: { timestamp: number; command: string }) =>
	`[${new Date(timestamp).toISOString().slice(11, 23)}] ${command}`;

/**
 *
 */
export class ConsoleService extends Array<{ timestamp: number; command: string }> {
	/**
	 *
	 * @private
	 */
	private listeners: Subscriber<this>[] = [];

	/**
	 *
	 */
	constructor() {
		localStorage.setItem(CONSOLE_KEY, '');
		super();
	}

	/**
	 *
	 */
	public placeholder: string = [
		['Enter\t\t\tSend command'],
		['↑ / ↓\t\t\tNavigate history'],
		['Ctrl + L\t\tClear']
	].join('\n');

	/**
	 *
	 * @param value
	 */
	public set(value: any): void {
		this.push(value);
	}

	/**
	 *
	 * @param listener
	 */
	public subscribe(listener: Subscriber<this>) {
		listener(this);
		this.listeners.push(listener);
		return () => (this.listeners = this.listeners.filter((l) => l !== listener));
	}

	/**
	 *
	 * @param command
	 */
	public write(command: string): void {
		if (this.length > 100) this.shift();
		this.push({ timestamp: Date.now(), command });

		this.listeners.forEach((l) => l(this));
		localStorage.setItem(CONSOLE_KEY, JSON.stringify(this));
	}

	/**
	 *
	 */
	public read(): string {
		return this.map(pr).join('\n');
	}

	/**
	 *
	 */
	public clear(): void {
		this.length = 0;
		localStorage.setItem(CONSOLE_KEY, '');
		this.listeners.forEach((l) => l(this));
	}
}
