import { findBestCombo } from "./stampFunction.js"
import { Inventory } from "./classes.js"

const stamps = new Inventory();
const resultStamps = new Inventory();

function addToInventory() {
    const val = document.querySelector('#value');
    const qty = document.querySelector('#quantity');
    // debugger
    stamps.addStamp(parseInt(val.value), parseInt(qty.value));
    val.value = '';
    qty.value = '';
    refreshInventory();

    localStorage.setItem('stamps', JSON.stringify(stamps));
    val.focus();
}

function refreshInventory() {
    const inventory = document.querySelector('#inventory')
    inventory.innerHTML = '';
    inventory.append(inventoryToHTML(stamps));
}

function inventoryToHTML(inventory, editable = true) {
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

        let quantity;

        if(editable) {
            quantity = document.createElement('input');
            quantity.setAttribute('type', 'number')
            quantity.value = stamp.qty

            quantity.addEventListener('change', (e) => {
                console.log(stamps);
                stamps.setStamp(parseInt(stamp.val), parseInt(quantity.value));
                localStorage.setItem('stamps', JSON.stringify(stamps));
                console.log('inventory updating')
                console.log(stamps);
            })
        } else {
            quantity = document.createElement('span');
            quantity.innerText = stamp.qty
        }

        quantity.setAttribute('class', 'quantity')


        stampDiv.appendChild(quantity)
        div.appendChild(stampDiv)
    }

    return div;
}

function refreshResult(inventory) {
    const result = document.querySelector('#result > .inventory')
    result.innerHTML = '';
    document.querySelector('#res-qty').innerText = inventory.totalQty;
    document.querySelector('#postage').innerText = inventory.totalVal;
    delete inventory.totalQty;
    delete inventory.totalVal;
    result.appendChild(inventoryToHTML(inventory, false));
}

//function sets the stamps variable to the inventory saved in local storage
function restoreInventory() {
    let stampJSON = localStorage.getItem('stamps');
    stampJSON = JSON.parse(stampJSON);

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
        const postage = document.querySelector('#desired-postage');
        const res = findBestCombo(stamps, parseInt(postage.value));
        if (res instanceof Inventory) {
            refreshResult(res);
        } else {
            document.querySelector('#result > .inventory').innerText = res
        }

    })

    document.querySelector('#clear-inventory').addEventListener('click', (e) => {
        e.preventDefault();
        stamps.clearInventory();
        localStorage.setItem('stamps', JSON.stringify(stamps));
        refreshInventory();
    })

    restoreInventory();
    refreshInventory();
}
