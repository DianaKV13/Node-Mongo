require('dotenv').config();
console.log('Loaded .env:', process.env.MONGO_URI, process.env.PORT);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { requestLogger } = require('./utils/logger');
const fileLogger = require('./utils/fileLogger');


const usersRoutes = require('./routes/users.routes');
const cardsRoutes = require('./routes/cards.routes');
const errorHandler = require('./middlewares/error.middleware');


const app = express();


app.use(express.json());


const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: (origin, cb) => cb(null, !origin || allowed.length === 0 || allowed.includes(origin)) }));


app.use(requestLogger);


app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);


// file logger captures responses after routes
app.use(fileLogger);


app.use(errorHandler);


const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URI)
.then(() => {
console.log('Connected to DB');
app.listen(PORT, () => console.log('Server listening on', PORT));
})
.catch(err => console.error('DB connection error', err));