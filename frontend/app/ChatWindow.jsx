/* @flow */

import React from "react";
import DSClient from "./DSClient";

export default class ChatWindow extends React.Component {
	static propTypes: Object = {
		defaultRoom: React.PropTypes.string.isRequired,
		self:        React.PropTypes.string.isRequired
	};

	state: {
		rooms: Array<string>
	} = {
		rooms: []
	};

	componentWillMount(): void {
		// Join default room
		DSClient.instance.callAPI(DSClient.ACTION_JOIN_ROOM, {"Name": this.props.defaultRoom});
	}

	render(): any {
		return <div />;
	}
};