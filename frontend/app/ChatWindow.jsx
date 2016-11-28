/* @flow */

import React from "react";
import DSClient from "./DSClient";

import styles from "./ChatWindow.module.scss";

class Room {
	name: string
	constructor(_name: string) {
		this.name = _name;
	}
}

class RoomList extends React.Component {
	static propTypes: Object = {
		rooms: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Room)).isRequired
	};

	render(): any {
		return <div className={styles.roomList}>
			{this.props.rooms.map(room => <div key={room.name} className={styles.roomListItem}>{room.name}</div>)}
		</div>;
	}
}

class PlayerList extends React.Component {
	render(): any {
		return <div className={styles.playerList}>
		</div>;
	}
}

export default class ChatWindow extends React.Component {
	static propTypes: Object = {
		defaultRoom: React.PropTypes.string.isRequired,
		self:        React.PropTypes.string.isRequired
	};

	state: {
		rooms:       Array<Room>,
		currentRoom: string
	} = {
		rooms:       [],
		currentRoom: ""
	};

	componentWillMount(): void {
		// Join default room
		DSClient.instance.callAPI(DSClient.ACTION_JOIN_ROOM, {"Name": this.props.defaultRoom});
	}

	render(): any {
		return <div className={styles.root}>
			<RoomList rooms={this.state.rooms} />
			<PlayerList />
		</div>;
	}
}