/* @flow */

import React    from "react";
import DSClient from "./DSClient";

import WelcomePage from "./Pages/WelcomePage";

import styles from "./App.module.scss";

import type { ServerMessage } from "./DSClient";

type PlayerRank = "RankNewbee" | "RankAverage" | "RankGood" | "RankMaster";

type PlayerData = {
	signedIn: bool,
	name: string,
	rank: PlayerRank
};

type PlayerStats = {
	connected: number,
	available: number
};

// Web client params
const StatPollInterval: number = 10000;
const DefaultRoom: string = "warsow";

class PlayerInfoWidget extends React.Component {
	static propTypes: Object = {
		playerData: React.PropTypes.object
	};

	defaultProps: Object = {
		playerData: { signedIn: false }
	};

	render(): any {
		const ranks: {[key: PlayerRank]: string} = {
			RankNewbee: "Newbee",
			RankAverage:"Average",
			RankGood:   "Very Good",
			RankMaster: "Master"
		};
		if (!this.props.playerData.signedIn) {
			return <div className={styles.currentPlayerInfo}><i>Not signed in</i></div>;
		}
		return <div className={styles.currentPlayerInfo}>
			<i>Signed in as</i>
			<div className={styles.currentPlayerName}>{this.props.playerData.name}</div>
			<div className={styles.currentPlayerRank}>{ranks[this.props.playerData.rank]}</div>
		</div>;
	}
}

class PlayerStatWidget extends React.Component {
	state: {
		waiting:     bool,
		playerStats: PlayerStats,
	} = {
		waiting:     true,
		playerStats: {}
	};

	pollerId: ?number = null;

	updateStats(msg: ServerMessage): void {
		this.setState({
			waiting:     false,
			playerStats: {
				connected: msg.Data.ClientsTotal,
				available: msg.Data.ClientsAvailable
			}
		});
	}

	pollStats(): void {
		DSClient.instance.callAPI(DSClient.ACTION_STATS, {}, this.updateStats.bind(this));
	}

	componentWillMount(): void {
		// Add polling
		this.pollerId = window.setInterval(this.pollStats.bind(this), StatPollInterval);
		this.pollStats();
	}

	componentWillUnmount(): void {
		// Remove polling
		if (this.pollerId !== null) {
			window.clearInterval(this.pollerId);
		}
	}

	render(): any {
		if (this.state.waiting) {
			return <div className={styles.playerSummary}><i>Loading summary…</i></div>;
		}
		return <div className={styles.playerSummary}>
			<span className={styles.playerCount}>{this.state.playerStats.connected}</span> players connected<br />
			<span className={styles.playerCount}>{this.state.playerStats.available}</span> available for dueling
		</div>;
	}
}

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

		// Join default room
		DSClient.instance.callAPI(DSClient.ACTION_JOIN_ROOM, {"Name": DefaultRoom});
	}

	componentWillMount(): void {
		// Handle "connected"
		this.checkDSClientStatus();

		// Handle "sign in"
		DSClient.instance.addEventListener(DSClient.SIGNEDIN, this.signIn.bind(this));
	}

	render(): any {
		if (!this.state.connected) {
			return <main role="main" style={{"justify-content": "center"}}>
				<img src="res/duesow-logo.svg" style={{"width": "250px"}} />
				<h1>Connecting, please wait…</h1>
			</main>;
		}

		let currentPage = null;
		if (!this.state.player.signedIn) {
			currentPage = <WelcomePage />;
		}

		return <main role="main">
			<header>
				<PlayerStatWidget />
				<div className={styles.logo}><img src="res/duesow-logo.svg" /></div>
				<PlayerInfoWidget playerData={this.state.player} />
			</header>
			{currentPage}
		</main>;
	}
}