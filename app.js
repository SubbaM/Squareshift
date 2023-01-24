const express = require('express');
// const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');

const cartRouter = require('./routes/cart');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

app.use('/cart', cartRouter);

// Expose Swagger 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require(process.env.swaggerDocument);

app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
app.use('/',(req,res) => res.send("Welcome!"));

module.exports = app;
