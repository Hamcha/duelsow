/* @flow */

import React from "react";
import { connect } from "react-redux";

import styles from "./App.module.scss";

import type State from "./reducers";

class App extends React.Component {
	static reduxMap(state: State): Object {
	}
	render(): any {
		return <main role="main">
			<header>
				<div className={styles.playerSummary}>
					<span className={styles.playerCount}>#</span> players connected<br />
					<span className={styles.playerCount}>#</span> players available for dueling
				</div>
				<div className={styles.logo}><img src="res/duesow-logo.svg" width="200px" /></div>
				<div>Put something here</div>
			</header>
		</main>;
	}
}

export default connect(App.reduxMap)(App);