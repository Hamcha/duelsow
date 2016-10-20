/* @flow */

import React from "react";
import DSClient from "./DSClient";

import styles from "./HeaderWidgets.module.scss";

import type { PlayerRank } from "./App";
import type { ServerMessage } from "./DSClient";

type PlayerStats = {
	connected: number,
	available: number
};

export class PlayerInfoWidget extends React.Component {
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

export class PlayerStatWidget extends React.Component {
	static propTypes: Object = {
		pollInterval: React.PropTypes.number
	}

	defaultProps: Object = {
		pollInterval: 5000
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
		DSClient.instance.callAPI(DSClient.ACTION_STATS, {}, this.updateStats.bind(this));
	}

	componentWillMount(): void {
		// Add polling
		this.pollerId = window.setInterval(this.pollStats.bind(this), this.props.pollInterval);
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