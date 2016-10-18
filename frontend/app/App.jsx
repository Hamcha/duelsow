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

const StatPollInterval: number = 10000;

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
			RankGood:   "Good",
			RankMaster: "Master"
		};
		if (!this.props.playerData.signedIn) {
			return <div className={styles.currentPlayerInfo}>Not signed in</div>;
		}
		return <div className={styles.currentPlayerInfo}>
			<div className={styles.currentPlayerName}>{this.props.playerData.name}</div>
			<div className={styles.currentPlayerRank}>{ranks[this.props.playerData.rank]}</div>
		</div>;
	}
}

class PlayerStatWidget extends React.Component {
	static propTypes: Object = {
		client: React.PropTypes.instanceOf(DSClient).isRequired
	}

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
		this.props.client.callAPI(DSClient.ACTION_STATS, {}, this.updateStats.bind(this));
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
			return <div className={styles.playerSummary}>Loading summary…</div>;
		}
		return <div className={styles.playerSummary}>
			<span className={styles.playerCount}>{this.state.playerStats.connected}</span> players connected<br />
			<span className={styles.playerCount}>{this.state.playerStats.available}</span> available for dueling
		</div>;
	}
}

export default class App extends React.Component {
	static propTypes: Object = {
		client: React.PropTypes.instanceOf(DSClient).isRequired
	}

	state: {
		waiting: bool
	} = {
		waiting: true
	};

	// Checks DSClient connection status to see if we have connected
	// to Duelsow's backend server.
	// If yes, set "waiting" to false, otherwise setup a callback.
	checkDSClientStatus(): void {
		// Create a function to remove the "waiting" state
		let remWaitFn: () => void = this.setState.bind(this, { waiting: false }, undefined);

		if (this.props.client.isConnected()) {
			remWaitFn();
		} else {
			this.props.client.addEventListener(DSClient.CONNECTED, remWaitFn);
		}
	}

	componentWillMount(): void {
		this.checkDSClientStatus();
	}

	render(): any {
		let data: PlayerData = {};
		if (this.state.waiting) {
			return <main role="main" style={{"justify-content": "center"}}>
				<img src="res/duesow-logo.svg" style={{"width": "250px"}} />
				<h1>Connecting, please wait…</h1>
			</main>;
		}
		return <main role="main">
			<header>
				<PlayerStatWidget client={this.props.client} />
				<div className={styles.logo}><img src="res/duesow-logo.svg" /></div>
				<PlayerInfoWidget playerData={data} />
			</header>
			<WelcomePage />
		</main>;
	}
}