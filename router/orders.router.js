const express = require('express')
const router = express.Router()
const controller = require('../controller/orders.controller.js')

router.route('/:id')
    .get(controller.getOrderById)

router.route('/user/:id')
    .get(controller.getOrderByUserId)

router.all('*', function (req, res) {
    res.status(404).json({ message: 'Rota não definida.' });
})

module.exports = router;