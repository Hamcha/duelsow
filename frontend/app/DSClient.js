/* @flow */

import EventTargetClass from "./Utils/EventTargetClass";

const APIVersion: number = 1;

//
// Client request struct/infos
//

export type ClientActionType = string;

export type ClientMessage = {
	ActionType: ClientActionType,
	Params:     any
};

//
// Server response struct/infos
//

export type ServerMessage = {
	OK:           bool,
	ResponseType: ServerResponseType,
	Data:         any,
	Error:        ?ServerError
};

export type ServerResponseType = string;

export type ServerError = {
	ErrorType: ServerErrorType,
	Message:   string
};

export type ServerErrorType = string;

export default class DSClient extends EventTargetClass {
	// Common backend addresses
	static HOST_LOCAL      : string = "localhost:7331";
	static HOST_PRODUCTION : string = "duelsow.eu:7331";
	static HOST_SAME       : string = ":7331";

	// Export current supported API version
	static API_VERSION: number = APIVersion;

	// Event types
	static CONNECTED: string = "connected";

	socket: WebSocket = null;

	constructor(host: string, encrypted: bool = true) {
		super();

		// Add local host if omitted
		if (host.startsWith(":")) {
			host = window.location.hostname + host;
		}

		// Add ws:// or wss:// prefix
		if (encrypted) {
			host = "wss://" + host;
		} else {
			host = "ws://" + host;
		}

		this.socket = new WebSocket(host, "dsapi-" + APIVersion);
		this.socket.onmessage = this._handleMessage;
		this.socket.onopen = this._trigger.bind(this, DSClient.CONNECTED);
	}

	isConnected(): bool {
		return this.socket.readyState === this.socket.OPEN;
	}

	/* Private / Should not be used outside */

	_trigger(eventType: string): void {
		let event = new Event(eventType);
		this.dispatchEvent(event);
	}

	_handleMessage(event: Event): void {
		let message: ServerMessage = JSON.parse(event.data);
		//TODO
		console.log(message);
	}
}