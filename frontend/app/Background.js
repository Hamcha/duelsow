/* @flow */

import styles from "./Background.module.scss";

class BackgroundWidget {
	bg: Background;
	currentBGText: Node;
	prevButton: Node;
	nextButton: Node;
	element: Node;
	constructor(bg: Background) {
		// Save BG instance
		this.bg = bg;

		// Create widget root element
		this.element = document.createElement("div");
		this.element.id = styles.widget;

		// Create widget children
		this.currentBGText = document.createElement("div");
		this.currentBGText.className = styles.widgetText;
		this.element.appendChild(this.currentBGText);

		// Create arrows for changing bg
		this.prevButton = document.createElement("div");
		this.prevButton.className = styles.widgetNavigator;
		this.prevButton.appendChild(document.createTextNode("<"));
		this.element.insertBefore(this.prevButton, this.currentBGText);

		this.nextButton = document.createElement("div");
		this.nextButton.className = styles.widgetNavigator;
		this.nextButton.appendChild(document.createTextNode(">"));
		this.element.appendChild(this.nextButton);

		// Make arrows work
		this.prevButton.addEventListener("click", this.nextBG.bind(this, true));
		this.nextButton.addEventListener("click", this.nextBG.bind(this, false));
	}
	nextBG(reverse: bool) {
		let currentIndex: number = Background.BGList.indexOf(this.bg.currentBG);
		if (currentIndex < 0) {
			throw "Current BG not in list (?)";
		}
		if (reverse) {
			currentIndex--;
			while (currentIndex < 0) {
				currentIndex += Background.BGList.length;
			}
		} else {
			currentIndex++;
			while (currentIndex >= Background.BGList.length) {
				currentIndex -= Background.BGList.length;
			}
		}
		this.bg.setBG(Background.BGList[currentIndex]);
	}
	changed(source: Background, path: string) {
		this.currentBGText.innerHTML = path;
	}
}

export default class Background {
	static BGList: Array<string> = [
		"wdm2-center",
		"wdm2-ra",
		"wdm5-center",
		"wdm5-mega",
		"wdm10-mega",
		"wdm10-ya",
		"wdm11-center",
		"wdm12-center",
		"wdm17-center"
	];
	bgElement: Node;
	widget: BackgroundWidget;
	currentBG: string;
	onChange: (bg: Background, path: string) => void;
	constructor(createWidget: bool) {
		// Create background
		this.bgElement = document.createElement("div");
		this.bgElement.id = styles.background;
		document.body.insertBefore(this.bgElement, document.body.firstChild);

		// Create widget if enabled
		if (createWidget) {
			this.widget = new BackgroundWidget(this);
			document.body.appendChild(this.widget.element);
			this.onChange = this.widget.changed.bind(this.widget);
		}
	}
	setBG(path: string): void {
		this.currentBG = path;
		this.bgElement.style.backgroundImage = `url(res/backgrounds/${path}.jpg)`;
		this.onChange(this, path);
	}
	setRandomBG(): void {
		let randomId: number = (Math.random() * Background.BGList.length) | 0;
		this.setBG(Background.BGList[randomId]);
	}
}