import "./home.scss";

const BGCount = 9;

let currentBG = (Math.random() * BGCount)|0;
let bgPath = `res/backgrounds/${currentBG}.jpg`;

document.getElementById("wswbg").style.backgroundImage = `url(${bgPath})`;