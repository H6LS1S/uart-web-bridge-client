/**
 *
 */
export class ApiService {
	/**
	 *
	 * @private
	 */
	private readonly url: string = '/api';

	/**
	 *
	 * @param url
	 * @param eventSourceInitDict
	 */
	public stream(url?: string | URL, eventSourceInitDict?: EventSourceInit): EventSource {
		return new EventSource(url || `${this.url}/stream`, eventSourceInitDict);
	}

	/**
	 *
	 * @param body
	 */
	public async sendData(body: string): Promise<Response> {
		return fetch(`${this.url}/send`, { method: 'POST', body: `${body}\n\r` });
	}

	/**
	 *
	 * @param body
	 */
	public async setBaudRate(body: string): Promise<Response> {
		return fetch(`${this.url}/baud`, { method: 'POST', body });
	}

	/**
	 *
	 * @param body
	 */
	public async updateFirmware(body: File): Promise<Response> {
		return fetch(`${this.url}/ota`, { method: 'POST', body });
	}
}
