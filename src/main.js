const electron = require("electron" );
const { app, BrowserWindow, Menu, MenuItem, Tray, ipcMain } = electron;
const fetch = require("electron-fetch");
const URL = require("url");
const Path = require("path");

var trayIcon = null;
let mainWindow = null;

const TRAY_ARROW_HEIGHT = 16;
const WINDOW_WIDTH = 410;
const WINDOW_HEIGHT = 410;
const HORIZ_PADDING = 15;
const VERT_PADDING = 0;

let window = {
	settings: null
};


app.on("ready", () => {



	// On macOS, hide the app from the dock:
	if ( process.platform === "darwin" ) {
		app.dock.hide();
	}
	// TODO: Later, make this adjustable per the user's preference.


	mainWindow = new BrowserWindow({
		icon: Path.join( __dirname, "assets/icon/BTC.png" ),
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
		resizable: false,
		frame: true,
		show: false,
		fullscreen: false,
		maximizable: false,
		titleBarStyle: "hiddenInset",
		backgroundColor: "#212529"
	});
	mainWindow.loadURL( URL.format({
		pathname: Path.join( app.getAppPath(), "src/windows/rendering.html" ),
		protocol: "file:",
		slashes: true
	}) );
	mainWindow.webContents.on("ready-to-show", function() {
		mainWindow.show();
		mainWindow.focus();
	});
	mainWindow.on("blur", function() {
		// mainWindow.hide();
	});

	mainWindow.on("close", function() {
		mainWindow.hide();
	});

	mainWindow.toggleDevTools();

	const iconName = "assets/image/taskbar.png";
	const iconPath = Path.join( __dirname, iconName );

	trayIcon = new Tray( iconPath );
	trayIcon.setToolTip("Coin Watcher");
	trayIcon.on( "click", (event) => {
		var screen = electron.screen;
		const cursorPosition = screen.getCursorScreenPoint();
		const primarySize = screen.getPrimaryDisplay().workAreaSize;
		const trayPositionVert = cursorPosition.y >= primarySize.height / 2 ? "bottom" : "top";
		const trayPositionHoriz = cursorPosition.x >= primarySize.width / 2 ? "right" : "left";
		mainWindow.setPosition( getTrayPosX(),  getTrayPosY() );
		mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();

		function getTrayPosX() {
			const horizBounds = {
				left:   cursorPosition.x - WINDOW_WIDTH / 2,
				right:  cursorPosition.x + WINDOW_WIDTH / 2
			};
			if ( trayPositionHoriz == "left" ) {
				return horizBounds.left <= HORIZ_PADDING ? HORIZ_PADDING : horizBounds.left;
			} else {
				return horizBounds.right >= primarySize.width ? primarySize.width - HORIZ_PADDING - WINDOW_WIDTH : horizBounds.right - WINDOW_WIDTH;
			}
		}
		function getTrayPosY() {
			return trayPositionVert == "bottom" ? cursorPosition.y - WINDOW_HEIGHT - VERT_PADDING : cursorPosition.y + VERT_PADDING;
		}
	});

	/*
	var menu = new Menu();

	menu.append( new MenuItem({ label: "Quit", click: () => app.quit() }) );

	ipcMain.on("show-config-menu", (event) => {
		menu.popup( mainWindow );
	});
	*/
});
/*
function fetchPrice() {
	console.log("Attempting to fetch price...");

	/*
	"https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR";

	{"BTC":0.03922,"USD":295.83,"EUR":257.43}


	fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
		.then( res => res.json() )
		.then( json => {
			console.log("Got price data!");
			if ( mainWindow ) {
				mainWindow.webContents.send("some-message", json );
			} else {
				console.warn("Couldn't find rendering.html!");
			}
		});

}
*/



ipcMain.on("get-prices", (event, data) => {

	let coins = "";
	for ( let code of data.list ) {
		coins += code;
		coins += ",";
	}
	fetch("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + coins + "&tsyms=" + data.fiat )
		.then( res => res.json() )
		.then( json => {
			if ( mainWindow ) {
				event.sender.send("return-prices", json );
			} else {
				console.warn("Couldn't find rendering.html!");
			}
		});
});

ipcMain.on("set-window-size", (event, data) => {
	mainWindow.setSize( WINDOW_WIDTH, 230, true );
});


ipcMain.on("open-settings", (event) => {
	console.log("POOP");
	window.settings = new BrowserWindow({
		icon: Path.join( __dirname, "assets/icon/BTC.png" ),
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
		resizable: false,
		frame: true,
		show: false,
		fullscreen: false,
		maximizable: false,
		titleBarStyle: "hiddenInset",
		backgroundColor: "#212529"
	});
	window.settings.loadURL( URL.format({
		pathname: Path.join( app.getAppPath(), "src/windows/settings.html" ),
		protocol: "file:",
		slashes: true
	}) );
	window.settings.on("ready-to-show", function() {
			window.settings.show();
			window.settings.focus();
	});
	window.settings.on("close", function() {
		window.settings.hide();
	});
});
