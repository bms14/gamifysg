const express = require('express');
const app = express();
const port = 3000;

app.use(express.json())
app.use('/score', require('./router/score.router'))
app.use('/prizes', require('./router/prizes.router'))
app.use('/medals',require('./router/medals.router'))
app.use('/products',require('./router/products.router'))
app.use('/orders', require('./router/orders.router'))

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`)
})