import { type MessageFns, WiFiConfigMsgType, WiFiConfigPayload } from '../protocomm/wifi_config';

/**
 *
 */
export class ApiService {
	/**
	 *
	 * @private
	 */
	private readonly url: string = import.meta.env.DEV ? '/api' : '';

	/**
	 *
	 * @private
	 */
	private readonly encoder = new TextEncoder();

	/**
	 *
	 * @param endpoint
	 * @param fns
	 * @param payload
	 * @private
	 */
	private async postProto<T>(endpoint: string, fns: MessageFns<T>, payload: T): Promise<any> {
		const headers = { 'Content-Type': 'application/x-protobuf' };
		const body = fns.encode(payload).finish();
		const response = await fetch(`${this.url}/${endpoint}`, { method: 'POST', headers, body })
			.then((res) => res.arrayBuffer())
			.then((buffer) => fns.decode(new Uint8Array(buffer)))
			.then(fns.toJSON);

		console.log(endpoint, payload, response);

		return response;
	}

	/**
	 *
	 * @param ssid
	 * @param passphrase
	 */
	public async setProvision(ssid: string, passphrase: string): Promise<WiFiConfigPayload> {
		const payload = WiFiConfigPayload.fromPartial({
			msg: WiFiConfigMsgType.TypeCmdSetConfig,
			cmdSetConfig: {
				ssid: this.encoder.encode(ssid),
				passphrase: this.encoder.encode(passphrase),
				bssid: new Uint8Array([])
			}
		});

		return this.postProto('prov-config', WiFiConfigPayload, payload);
	}

	/**
	 *
	 */
	public async applyProvision(): Promise<WiFiConfigPayload> {
		const payload = WiFiConfigPayload.fromPartial({
			msg: WiFiConfigMsgType.TypeCmdApplyConfig,
			cmdApplyConfig: {}
		});

		return this.postProto('prov-config', WiFiConfigPayload, payload);
	}

	/**
	 *
	 */
	public async getProvisionStatus(): Promise<WiFiConfigPayload> {
		const payload = WiFiConfigPayload.fromPartial({
			msg: WiFiConfigMsgType.TypeCmdGetStatus,
			cmdGetStatus: {}
		});

		return this.postProto('prov-config', WiFiConfigPayload, payload);
	}

	/**
	 *
	 * @param eventSourceInitDict
	 */
	public stream(eventSourceInitDict?: EventSourceInit): EventSource {
		return new EventSource(`${this.url}/stream`, eventSourceInitDict);
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
	public async changeFirmware(body: File): Promise<Response> {
		return fetch(`${this.url}/ota`, { method: 'POST', body });
	}
}
