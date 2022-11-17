// Modules to control application life and create native browser window
const {app, BrowserWindow,Menu} = require('electron')
const path = require('path')


//开机自启动
app.setLoginItemSettings({
	openAtLogin: false,
})

function createWindow () {

	const url = "https://haomooc.com/index.php?c=page&id=15";
	const appName = "益农直通车";

	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		backgroundColor: '#2e2c29',
		//frame: false, 
		fullscreen: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})

	// and load the index.html of the app.
	//mainWindow.loadFile('index.html')
	mainWindow.loadURL(url);
	const mainMenu = Menu.buildFromTemplate([
		{
			label: appName,
			click: function(){
				mainWindow.loadURL(url); 
			}
		},
		{ type: 'separator' },
		//{ role: 'toggleDevTools' },
		{
			label: '退出',
			role: 'quit'
		}
	]);
	Menu.setApplicationMenu(mainMenu);

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
}

let mainInstance = app.requestSingleInstanceLock()
if (!mainInstance) {
	app.quit()
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow()
	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
