require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./constants/limiter');
const router = require('./routes/index');
const { errorHandler } = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV, MONGODB_ADDRESS } = process.env;
const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(requestLogger);
app.use(limiter);
app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? MONGODB_ADDRESS : '', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
