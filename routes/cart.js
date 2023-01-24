
const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');

router.get('/items', async function(req, res) {
    const response = await cartController.getCartItems();
    res.status(response.status).send(response);
});

router.get('/checkout-value', async function(req, res) {
    const response = await cartController.calculateCheckOutValue(req.query.shipping_postal_code);
    res.status(response.status).send(response);
});

router.post('/item', async function(req, res) {
    const response = await cartController.addCartItem(req.query.product_id);
    res.status(response.status).send(response);
});

router.delete('/', async function(req, res) {
    const response = await cartController.deleteCartItems();
    res.status(response.status).send(response);
});

module.exports = router;