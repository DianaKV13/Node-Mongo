const morgan = require('morgan');


const requestLogger = morgan(':date[iso] :method :url :status :response-time ms');


module.exports = { requestLogger };