const axios = require('axios');
const cartModel = require('../models/cart');
// let cartItems = [];

async function getCartItems() {
    const cartItems = cartModel.getItems();
    // console.log(cartModel.getItems());
    if(cartItems.length === 0) {
        return {
            status: 404,
            message: 'Cart is empty',
        }
    } else {
        return {
            status: 200,
            response: cartItems
        }
    }
}

/*
    Validate Product Id and add to Cart Items Array
    Assumption - 
        * If the item to be added to cart is already present in the cart, message is sent with success status code 
*/
async function addCartItem(id) {
    // Validate Product ID 
    if(!Number.isInteger(parseInt(id))) {
        return {
            status: 404,
            message: 'Invalid Product Id format'
        }
    }

    // Validate if product is already present in the cart
    const cartItems = cartModel.getItems();
    if(cartItems.some((item) => item.id == id)) {
        return {
            status: 200,
            message: 'Item is already present in the cart and not added'
        }
    }

    // Fetch Item details
    try {
        const response = await axios.get(`${process.env.baseUrl}${process.env.productUrl}/${id}`);

        const data = response.data;
        if(data.status != 200) {
            return {
                status: 404,
                message: 'Item not found'
            }
        } else {
            // cartItems.push(data.response);
            cartModel.addItem(data.response);
            return {
                status: 200,
                message: 'Item added to cart'
            }
        }
    } catch(error) {
        console.error(error);
        return {
            status: 404,
            message: 'Unable to fetch Product details'
        };
    }
}

/*
    Empty the Cart Items Array
*/
async function deleteCartItems() {
    const cartItems = cartModel.getItems();
    if(cartItems.length === 0) {
        return {
            status: 404,
            message: 'Cart is empty'
        };
    }
    // cartItems = [];
    cartModel.deleteItems();
    return {
        status: 200,
        message: 'Removed all items from the cart'
    };
}

function calculateShippingCost(distanceInKM, totalWeight) {
    let cost = 0;
    if(distanceInKM < 5) {
        if(totalWeight < 2) {
            cost = 12;
        } else if(totalWeight <= 5) {
            cost = 14;
        } else if(totalWeight <= 5) {
            cost = 14;
        } else if(totalWeight <= 20) {
            cost = 16;
        } else {
            cost = 21;
        }
    } else if(distanceInKM < 20) {
        if(totalWeight < 2) {
            cost = 15;
        } else if(totalWeight <= 5) {
            cost = 18;
        } else if(totalWeight <= 20) {
            cost = 25;
        } else {
            cost = 35;
        }
    } else if(distanceInKM < 50) {
        if(totalWeight < 2) {
            cost = 20;
        } else if(totalWeight <= 5) {
            cost = 24;
        } else if(totalWeight <= 20) {
            cost = 30;
        } else {
            cost = 50;
        }
    } else if(distanceInKM < 500) {
        if(totalWeight < 2) {
            cost = 50;
        } else if(totalWeight <= 5) {
            cost = 55;
        } else if(totalWeight <= 20) {
            cost = 80;
        } else {
            cost = 90;
        }
    } else if(distanceInKM < 800) {
        if(totalWeight < 2) {
            cost = 100;
        } else if(totalWeight <= 5) {
            cost = 110;
        } else if(totalWeight <= 20) {
            cost = 130;
        } else {
            cost = 150;
        }
    } else {
        if(totalWeight < 2) {
            cost = 220;
        } else if(totalWeight <= 5) {
            cost = 250;
        } else if(totalWeight <= 20) {
            cost = 270;
        } else {
            cost = 300;
        }
    }
    return cost;
}

async function calculateCheckOutValue(postalCode) {
    const cartItems = cartModel.getItems();
    // Check if cart has items
    if(cartItems.length === 0) {
        return {
            status: 404,
            message: 'Cart is empty'
        }
    }

    // Validate postal code
    if(!postalCode || /\D/.test(postalCode)) {
        return {
            status: 404,
            message: 'Invalid Postal code format'
        }
    }

    // Calculate shipping distance
    try {    
        const response = await axios.get(`${process.env.baseUrl}${process.env.warehouseDistanceUrl}?postal_code=${postalCode}`);

        const data = response.data;
        if(data.status != 200) {
            return {
                status: 404,
                message: data.message
            }
        } else {
            // Calculate shipping cost
            const distanceInKM = data.distance_in_kilometers;
            let totalWeight = 0;
            let productPrice = 0;

            for(let i = 0; i < cartItems.length; i++) {
                totalWeight += cartItems[i].weight_in_grams;
                productPrice += (cartItems[i].price * (100 - cartItems[i].discount_percentage)/100);
            }
            const shippingCost = calculateShippingCost(distanceInKM, totalWeight);

            return {
                status: 200,
                response: {
                    shipping_cost: shippingCost.toFixed(2),
                    product_cost: productPrice.toFixed(2),
                    checkout_value: (shippingCost + productPrice).toFixed(2)
                }                
            }
        }
    } catch(error) {
        console.error(error);
        return {
            status: 404,
            message: 'Unable to fetch Warehouse distance'
        };
    }
}

module.exports = {
    getCartItems, addCartItem, deleteCartItems, calculateCheckOutValue
}