const fs = require('fs');
const path = require('path');


// middleware that appends a log file entry for responses with status >= 400
module.exports = function (req, res, next) {
const start = Date.now();
res.on('finish', () => {
const ms = Date.now() - start;
if (res.statusCode >= 400) {
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
const file = path.join(logDir, `${new Date().toISOString().slice(0,10)}.log`);
const entry = `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms\n`;
fs.appendFile(file, entry, err => { if (err) console.error('Failed to write log', err); });
}
});
next();
};