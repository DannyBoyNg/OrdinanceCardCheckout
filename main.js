// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const path = require('node:path');

// Sqlite3 Database
const Database = require('better-sqlite3');
const db = new Database('public/databaseV1.db');
db.pragma('journal_mode = WAL');

// Error Handling
process.on('uncaughtException', (error) => {
  console.error("Unexpected error: ", error);
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    minWidth: 900,
    height: 900,
    minHeight: 700,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('dist/ordinance-card-checkout/browser/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Sqlite API
const { ipcMain } = require('electron');  
ipcMain.handle('getUsers', async (_, arg) => getUsers());
ipcMain.handle('createUser', async (_, arg) => createUser(arg));
ipcMain.handle('updateUser', async (_, arg) => updateUser(arg));
ipcMain.handle('deleteUser', async (_, arg) => deleteUser(arg));

const getUsers = () => {
    try {
        const query = `SELECT * FROM users`;
        const readQuery = db.prepare(query);
        const rowList = readQuery.all();
        return rowList;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const createUser = (user) => {

    const count = getUsers().length;

    //try {
        const sql1 = `INSERT INTO users (name, barcode) VALUES (@name, @barcode)`;
        const sql2 = `INSERT INTO users (name, barcode, admin) VALUES (@name, @barcode, 1)`;
        const sql = (count == 0) ? sql2 : sql1;

        const insertQuery = db.prepare(sql);
        const transaction = db.transaction(() => {
            insertQuery.run(user);
        });
        transaction();
    //} catch (err) {
    //    console.error(err);
    //    throw err;
    //}
}

const updateUser = (user) => {
    try {
        const updateQuery = db.prepare(`UPDATE users SET name = @name, barcode = @barcode, admin = @admin WHERE id = @id`);
        const transaction = db.transaction(() => {
            updateQuery.run(user);
        });
        transaction();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const deleteUser = (id) => {
    try {
        const deleteQuery = db.prepare(`DELETE FROM users WHERE id = ?`);
        const transaction = db.transaction(() => {
            deleteQuery.run(id);
        });
        transaction();
    } catch (err) {
        console.error(err);
        throw err;
    }
}