const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Expose the same API both under / and /api for backward compatibility
app.use('/', routes);
app.use('/api', routes);

module.exports = app;