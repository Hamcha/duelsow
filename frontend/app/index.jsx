/* @flow */

import "./home.scss";

// Enable debug on local test environment
window.DEBUG = location.hostname === "localhost";

// Random background
import Background from "./Background";
window.Background = new Background(true);
window.Background.setRandomBG();

// Connect to duelsow backend
import DSClient from "./DSClient";
window.DSClient = new DSClient(DSClient.HOST_LOCAL, false);

//
// Prepare and render app
//

import React      from "react";
import { render } from "react-dom";
import App        from "./App";

render(
	<App client={window.DSClient} />,
	document.getElementById("app")
);