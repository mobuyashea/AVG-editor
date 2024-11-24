const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ejs = require('ejs');
const db = require('./db');

let mainWindow;

// 路由表
const routes = {
  '/': 'views/index.ejs',
  '/new-project': 'views/new-project.ejs',
  '/new-character': 'views/new-character.ejs',
};


// 创建窗口并加载默认页面
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: false, preload: path.join(__dirname, 'preload.js'),contextIsolation: true },
  });

  // 加载默认页面（/ 路由）
  const defaultRoute = '/';
  loadPage(defaultRoute);

  // 监听导航事件
  ipcMain.on('navigate', (event, route) => {
    if (routes[route]) {
      loadPage(route);
    } else {
      console.error('路由未找到:', route);
    }
  });
});



// 渲染并加载页面的函数
function loadPage(route) {
  const filePath = path.join(__dirname, '..', routes[route]); // 修正路径拼接

  ejs.renderFile(filePath, {}, (err, html) => {
    if (err) {
      console.error('EJS 渲染錯誤:', err);
      return;
    }
    mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));

    mainWindow.webContents.openDevTools();
  });
}


// 数据库相关功能
ipcMain.handle('get-users', (event) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle('add-user', (event, user) => {
  return new Promise((resolve, reject) => {
    const { name, age } = user;
    db.run(
      'INSERT INTO users (name, age) VALUES (?, ?)',
      [name, age],
      function (err) {
        if (err) {
          reject(err.message);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
});
