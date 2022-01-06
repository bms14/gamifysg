const express = require('express')
const router = express.Router()
const controller = require('../controller/products.controller.js')

router.route('/')
    .get(controller.getProducts)

router.route('/:id')
    .get(controller.getProductById)

router.route('/categories')
    .get(controller.getCategories)

router.route('/text/:text')
    .get(controller.getProductsByName)

router.all('*', function (req, res) {
    res.status(404).json({ message: 'Rota não definida.' });
})

module.exports = router;