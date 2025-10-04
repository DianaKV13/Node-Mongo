const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
const header = req.header('Authorization') || '';
if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });
const token = header.replace('Bearer ', '').trim();
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = payload;
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid token' });
}
};