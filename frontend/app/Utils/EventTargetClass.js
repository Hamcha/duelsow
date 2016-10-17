/* @flow */

export type EventHandlerFn = (e: Event) => void;

// Basic implementation of the EventTarget interface
// Most of the code is taken from:
//   https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
// and adapted to ES6 classes / flow annotations
export default class EventTargetClass {
	listeners: { [eventType: string]: Array<EventHandlerFn> } = {};

	addEventListener(eventType: string, callback: EventHandlerFn): void {
		if(!(eventType in this.listeners)) {
			this.listeners[eventType] = [];
		}
		this.listeners[eventType].push(callback);
	}

	removeEventListener(eventType: string, callback: EventHandlerFn): void {
		if(!(eventType in this.listeners)) {
			return;
		}
		let stack: Array<EventHandlerFn> = this.listeners[eventType];
		for(let i: number = 0, l: number = stack.length; i < l; i++) {
			if(stack[i] === callback){
				stack.splice(i, 1);
				this.removeEventListener(eventType, callback);
				return;
			}
		}
	}

	dispatchEvent(event: Event): void {
		if(!(event.type in this.listeners)) {
			return;
		}
		let stack: Array<EventHandlerFn> = this.listeners[event.type];
		for(let i: number = 0, l: number = stack.length; i < l; i++) {
			stack[i].call(this, event);
		}
	}
}