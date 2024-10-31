const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/hello', (req, res) => {
  res.send('Hello, World! It is Mariem Moula learning DevOps .\n');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
