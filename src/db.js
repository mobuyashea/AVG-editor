const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 定義根目錄和資料夾
const baseDir = path.join(__dirname, '..'); // 回到專案根目錄
const dataDir = path.join(baseDir, 'data');

// 確保資料夾存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// 初始化資料庫
const dbPath = path.join(dataDir, 'my_database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('資料庫連線失敗', err.message);
  } else {
    console.log('資料庫連線成功', dbPath);
  }
});

// 建立表格
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL
    )
  `);
});

module.exports = db;
