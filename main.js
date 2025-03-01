// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const Database = require('better-sqlite3');

const createTableLogs = `CREATE TABLE IF NOT EXISTS "Logs" (
	"Id"	INTEGER NOT NULL UNIQUE,
	"Timestamp"	TEXT NOT NULL,
	"Action"	TEXT NOT NULL,
	"UserId"	INTEGER,
	"CardId"	INTEGER NOT NULL,
	PRIMARY KEY("Id" AUTOINCREMENT)
)`;
const createTableUsers = `CREATE TABLE IF NOT EXISTS "Users" (
	"Id"	INTEGER NOT NULL UNIQUE,
	"Name"	TEXT NOT NULL,
	"BarCode"	TEXT NOT NULL UNIQUE,
	"Admin"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("Id" AUTOINCREMENT)
)`;
const createTableCards = `CREATE TABLE IF NOT EXISTS "OrdinanceCards" (
	"Id"	INTEGER NOT NULL UNIQUE,
	"BarCode"	TEXT NOT NULL UNIQUE,
	"Language"	TEXT NOT NULL,
	"CheckedOut"	INTEGER NOT NULL DEFAULT 0,
	"CheckedOutBy"	TEXT,
	"CheckedOutAt"	TEXT,
	PRIMARY KEY("Id" AUTOINCREMENT)
)`;

const createTables = (!fs.existsSync('./databaseV1.db'));

// Sqlite3 Database
const db = new Database('./databaseV1.db');
db.pragma('journal_mode = WAL');

if (createTables) {
  db.exec(createTableLogs);
  db.exec(createTableUsers);
  db.exec(createTableCards);
}

// Error Handling
process.on('uncaughtException', (error) => {
  console.error("Unexpected error: ", error);
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, '/public/favicon.ico'),
    autoHideMenuBar: true,
    width: 1600,
    minWidth: 1000,
    height: 900,
    minHeight: 700,
    fullscreen: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('dist/ordinance-card-checkout/browser/index.html');

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
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
ipcMain.handle('getUser', async (_, arg) => getUser(arg));
ipcMain.handle('createUser', async (_, arg) => createUser(arg));
ipcMain.handle('updateUser', async (_, arg) => updateUser(arg));
ipcMain.handle('deleteUser', async (_, arg) => deleteUser(arg));
ipcMain.handle('getCards', async (_, arg) => getCards());
ipcMain.handle('getCard', async (_, arg) => getCard(arg));
ipcMain.handle('createCard', async (_, arg) => createCard(arg));
ipcMain.handle('updateCard', async (_, arg) => updateCard(arg));
ipcMain.handle('deleteCard', async (_, arg) => deleteCard(arg));
ipcMain.handle('getLogs', async (_, arg) => getLogs(arg));
ipcMain.handle('createLog', async (_, arg) => createLog(arg));
ipcMain.handle('getUserIdFromLastCheckOutByCardId', async (_, arg) => getUserIdFromLastCheckOutByCardId(arg));

//Users
const getUsers = () => {
  const query = `SELECT * FROM users`;
  const readQuery = db.prepare(query);
  const rowList = readQuery.all();
  return rowList;
}

const getUser = (barcode) => {
  const query = `SELECT * FROM users WHERE barcode = ?`;
  const stmt = db.prepare(query);
  return stmt.get(barcode);
}

const createUser = (user) => {
  const count = getUsers().length;
  const sql1 = `INSERT INTO users (name, barcode) VALUES (@Name, @BarCode)`;
  const sql2 = `INSERT INTO users (name, barcode, admin) VALUES (@Name, @BarCode, 1)`;
  const sql = (count == 0) ? sql2 : sql1;
  const insertQuery = db.prepare(sql);
  const transaction = db.transaction(() => {
      insertQuery.run(user);
  });
  transaction();
}

const updateUser = (user) => {
  const updateQuery = db.prepare(`UPDATE users SET name = @Name, barcode = @BarCode, admin = @Admin WHERE id = @Id`);
  const transaction = db.transaction(() => {
      updateQuery.run(user);
  });
  transaction();
}

const deleteUser = (id) => {
  const deleteQuery = db.prepare(`DELETE FROM users WHERE id = ?`);
  const transaction = db.transaction(() => {
      deleteQuery.run(id);
  });
  transaction();
}

//Cards
const getCards = () => {
  const query = `SELECT * FROM OrdinanceCards ORDER BY barcode`;
  const readQuery = db.prepare(query);
  const rowList = readQuery.all();
  return rowList;
}

const getCard = (barcode) => {
  const query = `SELECT * FROM OrdinanceCards WHERE barcode = ?`;
  const stmt = db.prepare(query);
  return stmt.get(barcode);
}

const createCard = (card) => {
  const query = `INSERT INTO OrdinanceCards (barcode, Language) VALUES (@BarCode, @Language)`;
  const insertQuery = db.prepare(query);
  const transaction = db.transaction(() => {
      insertQuery.run(card);
  });
  transaction();
}

const updateCard = (card) => {
  const updateQuery = db.prepare(`UPDATE OrdinanceCards SET barcode = @BarCode, language = @Language, checkedOut = @CheckedOut, checkedOutBy = @CheckedOutBy, checkedOutAt = @CheckedOutAt WHERE id = @Id`);
  const transaction = db.transaction(() => {
      updateQuery.run(card);
  });
  transaction();
}

const deleteCard = (id) => {
  const deleteQuery = db.prepare(`DELETE FROM OrdinanceCards WHERE id = ?`);
  const transaction = db.transaction(() => {
      deleteQuery.run(id);
  });
  transaction();
}

//Logs
const getLogs = () => {
  const query = `SELECT timestamp, action, ordinanceCards.barcode, users.name FROM logs LEFT JOIN users on logs.userId = users.Id LEFT JOIN ordinanceCards on logs.cardId = ordinanceCards.Id ORDER BY timestamp DESC LIMIT 1000`;
  const readQuery = db.prepare(query);
  const rowList = readQuery.all();
  return rowList;
}

const createLog = (log) => {
  const query = `INSERT INTO logs (timestamp, action, cardId, userId) VALUES (@Timestamp, @Action, @CardId, @UserId)`;
  const insertQuery = db.prepare(query);
  const transaction = db.transaction(() => {
      insertQuery.run(log);
  });
  transaction();
}

const getUserIdFromLastCheckOutByCardId = (cardId) => {
  const query = `SELECT userId FROM logs WHERE cardId = ? AND action = 'CheckOut' ORDER BY timestamp DESC LIMIT 1`;
  const stmt = db.prepare(query);
  return stmt.get(cardId);
}