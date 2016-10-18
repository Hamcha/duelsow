/* @flow */

import React from "react";

import styles from "./WelcomePage.module.scss";

export default class WelcomePage extends React.Component {
	render(): any {
		return <section>
			<h1>Welcome to Duelsow</h1>
			<p className={styles.copy}>Duelsow.eu is a matchmaking tool for finding people to duel with in <a href="https://www.warsow.net/">Warsow</a>.</p>
			<p className={styles.copy}>After you sign in, you can see the list of connected players, their rank and status (available or not).<br />If you don't find anyone to play with you can keep this website open in the background while doing other things to show that you are available for playing. You will receive a browser notification (just be sure to allow Duelsow to send them when the prompt will appear) as soon as someone requests to play with you!</p>
		</section>;
	}
}