const express = require('express')
const router = express.Router()
const controller = require('../controller/products.controller.js')

router.route('/')
    .get(controller.getProducts)

router.route('/:id')
    .get(controller.getProductById)

router.all('*', function (req, res) {
    res.status(404).json({ message: 'Rota não definida.' });
})

module.exports = router;