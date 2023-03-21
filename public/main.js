import { findBestCombo } from "./stampFunction.js"
import { Inventory } from "./classes.js"

const stamps = new Inventory();

function addToInventory() {
    const val = document.querySelector('#value');
    const qty = document.querySelector('#quantity');
    // debugger
    stamps.addStamp(parseInt(val.value), parseInt(qty.value));
    val.value = '';
    qty.value = '';
    refreshInventory();
    // console.log(stamps)
    localStorage.setItem('stamps', JSON.stringify(stamps));
}

function refreshInventory() {
    const inventory = document.querySelector('#inventory')
    inventory.innerHTML = '';

    console.log(inventoryToHTML(stamps).children)
    inventory.append(inventoryToHTML(stamps));
}

function inventoryToHTML(inventory) {
    if (inventory instanceof Inventory === false) {
        throw new TypeError('input must be of class inventory')
    }

    const div = document.createDocumentFragment();
    for (const entry in inventory) {
        const stamp = inventory[entry];
        const stampDiv = document.createElement('div');
        stampDiv.setAttribute('class', 'stamp')

        const value = document.createElement('span');
        value.setAttribute('class', 'value')
        value.innerText = stamp.val;
        stampDiv.appendChild(value);

        const mult = document.createElement('div');
        mult.setAttribute('class', 'mult');
        mult.innerText = 'X'
        stampDiv.appendChild(mult);

        const quantity = document.createElement('span');
        quantity.setAttribute('class', 'quantity')
        quantity.innerText = stamp.qty
        stampDiv.appendChild(quantity)

        div.appendChild(stampDiv)
    }

    return div;
}

function refreshResult(inventory) {
    const result = document.querySelector('#result')
    document.querySelector('#res-qty').innerText = inventory.totalQty;
    document.querySelector('#postage').innerText = inventory.totalVal;
    delete inventory.totalQty;
    delete inventory.totalVal;
    result.appendChild(inventoryToHTML(inventory));
}

//function sets the stamps variable to the inventory saved in local storage
function restoreInventory() {
    let stampJSON = localStorage.getItem('stamps');
    stampJSON = JSON.parse(stampJSON);
    console.log(stampJSON)

    for (const stamp in stampJSON) {
        stamps.addStamp(stampJSON[stamp].val, stampJSON[stamp].qty)
    }
    console.log(stamps)
}

window.onload = () => {
    document.querySelector('#addStampButton').addEventListener('click', (e)=> {
        e.preventDefault();
        addToInventory();
    })

    document.querySelector('#calculate').addEventListener('click', (e) => {
        e.preventDefault();
        const res = findBestCombo(stamps, 4);
        console.log(res)
        refreshResult(res);
    })

    document.querySelector('#clear-inventory').addEventListener('click', (e) => {
        stamps.clearInventory();
        refreshInventory();
    })

    restoreInventory();
    refreshInventory();
}
