// Modules to control application life and create native browser window
const {autoUpdater} = require('electron-updater')
const {app, BrowserWindow,Menu} = require('electron')
const path = require('path')


//开机自启动
app.setLoginItemSettings({
	openAtLogin: false,
})

function createWindow () {

	const url = "https://haomooc.com/index.php?c=page&id=15";
	const updateUrl = "https://haomooc.com/uploads/desktop_app/yinong";
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

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle(){
    let message={
      error:'检查更新出错',
      checking:'正在检查更新……',
      updateAva:'检测到新版本，正在下载……',
      updateNotAva:'现在使用的就是最新版本，不用更新',
    };
    const os = require('os');
    autoUpdater.setFeedURL(updateUrl);
    autoUpdater.on('error', function(error){
      sendUpdateMessage(message.error)
    });
    autoUpdater.on('checking-for-update', function() {
      sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', function(info) {
        sendUpdateMessage(message.updateAva)
    });
    autoUpdater.on('update-not-available', function(info) {
        sendUpdateMessage(message.updateNotAva)
    });
    
    // 更新下载进度事件
    autoUpdater.on('download-progress', function(progressObj) {
        mainWindow.webContents.send('downloadProgress', progressObj)
    })
    autoUpdater.on('update-downloaded',  function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        ipcMain.on('isUpdateNow', (e, arg) => {
            //some code here to handle event
            autoUpdater.quitAndInstall();
        })
        mainWindow.webContents.send('isUpdateNow')
    });
    
    //执行自动更新检查
    autoUpdater.checkForUpdates();
}

// 通过main进程发送事件给renderer进程，提示更新信息
// mainWindow = new BrowserWindow()
function sendUpdateMessage(text){
    mainWindow.webContents.send('message', text)
}