module.exports = function (err, req, res, next) {
console.error(err);
if (err.isJoi) return res.status(400).json({ message: err.details.map(d => d.message).join(', ') });
res.status(err.status || 500).json({ message: err.message || 'Server error' });
};