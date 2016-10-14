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
import { Provider }   from "react-redux";
import App            from "./App";
import configureStore from "./store/configureStore";

const store = configureStore();

render(
	<Provider store={store}><App /></Provider>,
	document.getElementById("app")
);