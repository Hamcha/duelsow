/* @flow */

import React from "react";

import styles from "./WelcomePage.module.scss";

export default class WelcomePage extends React.Component {
	render(): any {
		return <section>
			<h1>Welcome to Duelsow</h1>
			<p className={styles.copy}>Duelsow.eu is a matchmaking tool for finding people to duel with in <a href="https://www.warsow.net/">Warsow</a>.</p>
			<p className={styles.copy}>After you sign in, you can see the list of connected players, their rank and status (available or not).<br />If you don't find anyone to play with you can keep this website open in the background while doing other things to show that you are available for playing. You will receive a browser notification (just be sure to allow Duelsow to send them when the prompt will appear) as soon as someone requests to play with you!</p>
			<p className={styles.copy}>When you are ready, fill the form below and sign in!</p>
			<div className={styles.signInForm}>
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
							<td width="45%"><input type="text" name="nickname" z-index="1" /></td>
							<td className={styles.rankRow}>
								<input type="radio" name="rank" id="RankNewbee" />
								<label htmlFor="RankNewbee" className={styles.rankOption}>Newbee</label>
								<input type="radio" name="rank" id="RankAverage" />
								<label htmlFor="RankAverage" className={styles.rankOption}>Average</label>
								<input type="radio" name="rank" id="RankGood" />
								<label htmlFor="RankGood" className={styles.rankOption}>Very Good</label>
								<input type="radio" name="rank" id="RankMaster" />
								<label htmlFor="RankMaster" className={styles.rankOption}>Master</label>
							</td>
							<td width="20%"><button z-index="4">Sign in</button></td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>;
	}
}