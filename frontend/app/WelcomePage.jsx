/* @flow */

import React    from "react";
import DSClient from "./DSClient";

import type { ServerMessage } from "./DSClient";

import styles from "./WelcomePage.module.scss";

export default class WelcomePage extends React.Component {
	state: {
		waiting: bool,
		error:   ?string
	} = {
		waiting: false,
		error:   null
	};

	checkValidity(): void {
		if (this.state.waiting) {
			document.getElementById("signin").disabled = true;
			return;
		}
		let form: HTMLFormElement = document.forms.signin;
		let valid: boolean = form.rank.value !== "" && form.nickname.value !== "";
		document.getElementById("signin").disabled = !valid;
	}

	signIn(e: Event): void {
		const that = this;

		e.preventDefault();
		let form: HTMLFormElement = document.forms.signin;
		let playerName: string = form.nickname.value;
		let playerRank: string = form.rank.value;
		DSClient.instance.callAPI(DSClient.ACTION_SIGN_IN, {
			"Name": playerName,
			"Rank": playerRank
		}, function(data: ServerMessage) {
			// Only care about errors
			if (!data.ResponseType.startsWith("error-")) {
				return;
			}
			that.setState({ waiting: false, error: data.Error.Message }, that.checkValidity.bind(that));
		});

		this.setState({ waiting: true }, this.checkValidity.bind(this));
	}

	render(): any {
		let loginError = null;

		if (this.state.error !== null) {
			loginError = <p className={styles.signinError}>Encountered error while signing in: <b>{this.state.error}</b></p>;
		}

		return <section>
			<h1>Welcome to Duelsow</h1>
			<p className={styles.copy}>Duelsow.eu is a matchmaking tool for finding people to duel with in <a href="https://www.warsow.net/">Warsow</a>.</p>
			<p className={styles.copy}>To start using it, just fill the form below! No further registration required!</p>
			<div className={styles.signInForm}>
				<form name="signin" onSubmit={this.signIn.bind(this)}>
				<table>
					<thead>
						<tr>
							<th>Nickname</th>
							<th>Skill level</th>
							<th>{/* Button row */}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td width="45%"><input required type="text" name="nickname" onChange={this.checkValidity.bind(this)}  disabled={this.state.waiting} /></td>
							<td className={styles.rankRow}>
								<input required type="radio" name="rank" value="RankNewbee" id="RankNewbee" onChange={this.checkValidity.bind(this)} disabled={this.state.waiting} />
								<label htmlFor="RankNewbee" className={styles.rankOption}>Newbee</label>
								<input type="radio" name="rank" value="RankAverage" id="RankAverage" onChange={this.checkValidity.bind(this)} disabled={this.state.waiting} />
								<label htmlFor="RankAverage" className={styles.rankOption}>Average</label>
								<input type="radio" name="rank" value="RankGood" id="RankGood" onChange={this.checkValidity.bind(this)} disabled={this.state.waiting} />
								<label htmlFor="RankGood" className={styles.rankOption}>Very Good</label>
								<input type="radio" name="rank" value="RankMaster" id="RankMaster" onChange={this.checkValidity.bind(this)} disabled={this.state.waiting} />
								<label htmlFor="RankMaster" className={styles.rankOption}>Master</label>
							</td>
							<td width="20%"><button id="signin" disabled>Sign in</button></td>
						</tr>
					</tbody>
				</table>
				</form>
			</div>
			{loginError}
		</section>;
	}
}