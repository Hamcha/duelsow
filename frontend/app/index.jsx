import "./home.scss";

// Random background
import Background from "./Background";
window.Background = new Background(true);
window.Background.setRandomBG();

//
// Prepare and render app
//

import React          from "react";
import { render }     from "react-dom";
import App            from "./App";

render(
	<App />,
	document.getElementById("app")
);