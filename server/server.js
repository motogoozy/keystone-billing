const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 4300;

app.use(express.static(`${__dirname}/../build`));
app.use(express.json());

app.listen(port, () => {
  console.log(`${port} ducks marching on Rome...`);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.use((err, req, res, next) => {
  if (!err) return next();

  let statusCode = err.statusCode || 500;

  res.status(statusCode).send('Internal Server Error');
});
