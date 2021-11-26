const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use('/score', require('./router/score.router'));
app.use('/prizes', require('./router/prizes.router'));

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`)
})