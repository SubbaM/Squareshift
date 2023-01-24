const fs = require('fs');
const path = require('path');

function getItems() {
    const items = fs.readFileSync(path.resolve(__dirname, process.env.cartItemsFile), 'utf-8');
    return items && items !== ''? JSON.parse(items): [];
}

function addItem(item) {
    const fileContent = fs.readFileSync(path.resolve(__dirname, process.env.cartItemsFile), 'utf-8');
    const items = fileContent && fileContent !== ''? JSON.parse(fileContent): [];
    items.push(item);
    fs.writeFileSync(path.resolve(__dirname, process.env.cartItemsFile), JSON.stringify(items));
    return;
}

function deleteItems() {
    fs.writeFileSync(path.resolve(__dirname, process.env.cartItemsFile), '');
    return;
}

module.exports = {
    getItems, addItem, deleteItems
}