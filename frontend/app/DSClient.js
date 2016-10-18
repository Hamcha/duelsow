/* @flow */

import EventTargetClass from "./Utils/EventTargetClass";

//
// Client request struct/infos
//

export type ClientActionType = string;

export type ClientMessage = {
	Tag:        string,
	ActionType: ClientActionType,
	Params:     any
};

//
// Server response struct/infos
//

export type ServerMessage = {
	OK:            bool,
	ReplyTag:      ?string,
	MessageSource: ?string,
	ResponseType:  ServerResponseType,
	Data:          any,
	Error:         ?ServerError
};

export type ServerResponseType = string;

export type ServerError = {
	ErrorType: ServerErrorType,
	Message:   string
};

export type ServerErrorType = string;

export type ServerResponseHandler = (reply: ServerMessage) => void;

export default class DSClient extends EventTargetClass {
	// Common backend addresses
	static HOST_LOCAL      : string = "localhost:7331";
	static HOST_PRODUCTION : string = "duelsow.eu:7331";
	static HOST_SAME       : string = ":7331";

	// Event types
	static CONNECTED: string = "connected";

	// Client action APIs
	static ACTION_STATS: ClientActionType = "stats";

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

		this.socket = new WebSocket(host, "ds-wsapi");
		this.socket.onmessage = this._handleMessage.bind(this);
		this.socket.onopen = this._trigger.bind(this, DSClient.CONNECTED);
	}

	isConnected(): bool {
		return this.socket.readyState === this.socket.OPEN;
	}

	callAPI(action: ClientActionType, params: Object, callback: ?ServerResponseHandler = null): void {
		let request: ClientMessage = {
			"Tag":        this._newTag(),
			"ActionType": action,
			"Params":     params
		};
		if (callback !== null) {
			this._registerCallback(request.Tag, callback);
		}
		this.socket.send(JSON.stringify(request));
	}

	/* Private / Should not be used outside */

	// Callbacks are stored based on the tag of their request
	_callbacks: {[key: string]: ServerResponseHandler} = {};

	_trigger(eventType: string): void {
		let event = new Event(eventType);
		this.dispatchEvent(event);
	}

	_handleMessage(event: Event): void {
		let message: ServerMessage = JSON.parse(event.data);
		if (window.DEBUG) {
			console.log(message);
		}
		if (message.ReplyTag in this._callbacks) {
			this._callbacks[message.ReplyTag](message);
			delete this._callbacks[message.ReplyTag];
		}
	}

	_newTag(): string {
		// Generate random tags until there is one not already in the callback list
		let id: string = "";

		do {
			// Cheap way to get random IDs!
			id = Math.random().toString(32).slice(2);
		} while (id in this._callbacks);

		return id;
	}

	_registerCallback(id: string, callback: ServerResponseHandler): void {
		this._callbacks[id] = callback;
	}
}