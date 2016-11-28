/* @flow */

import React    from "react";
import DSClient from "./DSClient";

import { PlayerStatWidget, PlayerInfoWidget } from "./HeaderWidgets";
import WelcomePage from "./WelcomePage";
import ChatWindow from "./ChatWindow";

import styles from "./App.module.scss";

// Web client params
const StatPollInterval: number = 10000;
const DefaultRoom: string = "warsow";

type PlayerRank = "RankNewbee" | "RankAverage" | "RankGood" | "RankMaster";

type PlayerData = {
	signedIn: bool,
	name: string,
	rank: PlayerRank
};

export default class App extends React.Component {
	state: {
		connected: bool,
		player:    PlayerData
	} = {
		connected: false,
		player:    { signedIn: false }
	};

	// Checks DSClient connection status to see if we have connected
	// to Duelsow's backend server.
	// If yes, set "connected" to true, otherwise setup a callback.
	checkDSClientStatus(): void {
		// Create a function to set the "connected" state
		let remWaitFn: () => void = this.setState.bind(this, { connected: true }, undefined);

		if (DSClient.instance.isConnected()) {
			remWaitFn();
		} else {
			DSClient.instance.addEventListener(DSClient.CONNECTED, remWaitFn);
		}
	}

	signIn(e: Event): void {
		// Set signed in player as current player
		this.setState({
			player: {
				name: e.detail.Player.Name,
				rank: e.detail.Player.Rank,
				signedIn: true
			}
		});
	}

	componentWillMount(): void {
		// Handle "connected"
		this.checkDSClientStatus();

		// Handle "sign in"
		DSClient.instance.addEventListener(DSClient.SIGNEDIN, this.signIn.bind(this));
	}

	render(): any {
		if (!this.state.connected) {
			return <main role="main">
				<img src="res/duesow-logo.svg" style={{"width": "250px"}} />
				<h1>Connecting, please wait…</h1>
			</main>;
		}

		let currentPage = null;
		if (!this.state.player.signedIn) {
			currentPage = <WelcomePage />;
		} else {
			currentPage = <section id={styles.mainPage}>
				<ChatWindow defaultRoom={DefaultRoom} self={this.state.player.name} />
			</section>;
		}

		return <main role="main">
			<header>
				<PlayerStatWidget pollInterval={StatPollInterval} />
				<div className={styles.logo}><img src="res/duesow-logo.svg" /></div>
				<PlayerInfoWidget playerData={this.state.player} />
			</header>
			{currentPage}
		</main>;
	}
}